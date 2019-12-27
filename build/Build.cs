using Nuke.Common;
using Nuke.Common.Git;
using Nuke.Common.Tools.GitVersion;
using System.IO;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;
using static Nuke.Common.Tools.Npm.NpmTasks;
using static Nuke.GitHub.GitHubTasks;
using static Nuke.Common.ChangeLog.ChangelogTasks;
using Nuke.Azure.KeyVault;
using System.Linq;
using Nuke.GitHub;
using System;
using Nuke.Common.ProjectModel;
using System.Threading.Tasks;
using Nuke.Common.Utilities.Collections;

class Build : NukeBuild
{
    public static int Main() => Execute<Build>(x => x.Clean);

    [KeyVaultSettings(
        BaseUrlParameterName = nameof(KeyVaultBaseUrl),
        ClientIdParameterName = nameof(KeyVaultClientId),
        ClientSecretParameterName = nameof(KeyVaultClientSecret))]
    readonly KeyVaultSettings KeyVaultSettings;

    [Parameter] string KeyVaultBaseUrl;
    [Parameter] string KeyVaultClientId;
    [Parameter] string KeyVaultClientSecret;
    [GitVersion] readonly GitVersion GitVersion;
    [GitRepository] readonly GitRepository GitRepository;

    [KeyVaultSecret] string GitHubAuthenticationToken;

    [Solution("angular-material-shared.sln")] readonly Solution Solution;
    AbsolutePath SolutionDirectory => Solution.Directory;
    AbsolutePath OutputDirectory => SolutionDirectory / "output";
    AbsolutePath SourceDirectory => SolutionDirectory / "src";
    AbsolutePath TinyMceLanguagesDirectory => NgAppDir / "dist" / "angular-material-shared" / "tinymce-langs";
    string ChangeLogFile => RootDirectory / "CHANGELOG.md";

    Target Clean => _ => _
            .Executes(() =>
            {
                GlobDirectories(SourceDirectory, "angular-material-shared-demo/dist").ForEach(DeleteDirectory);
                EnsureCleanDirectory(OutputDirectory);
                EnsureCleanDirectory(TinyMceLanguagesDirectory);
            });

    AbsolutePath NgAppDir => SourceDirectory / "angular-material-shared-demo";

    private async Task CopyTinyMceLanguagesToDestination()
    {
        EnsureCleanDirectory(TinyMceLanguagesDirectory);
        var languageFiles = GlobFiles(NgAppDir / "node_modules" / "tinymce-i18n" / "langs5", "*.js").NotEmpty();
        foreach (var languageFile in languageFiles)
        {
            var fileName = Path.GetFileName(languageFile);
            var destinationPath = Path.Combine(TinyMceLanguagesDirectory, fileName);
            using (var sourceStream = File.OpenRead(languageFile))
            {
                using (var destinationFileStream = System.IO.File.Create(destinationPath))
                {
                    await sourceStream.CopyToAsync(destinationFileStream);
                }
            }
        }
    }

    Target NgLibraryBuild => _ => _
        .DependsOn(Clean)
        .Executes(async () =>
        {
            if (IsLocalBuild)
            {
                Npm("i", NgAppDir);
            }
            else
            {
                Npm("ci", NgAppDir);
            }
            Npm("run build:library", NgAppDir);
            Npm($"version {GitVersion.NuGetVersion}", NgAppDir / "dist" / "angular-material-shared");
            await CopyTinyMceLanguagesToDestination();

            var srcReadmePath = SolutionDirectory / "README.md";
            var destReadmePath = NgAppDir / "dist" / "angular-material-shared" / "README.md";
            if (File.Exists(destReadmePath))
            {
                File.Delete(destReadmePath);
            }
            File.Copy(srcReadmePath, destReadmePath);
        });

    Target NgLibraryTest => _ => _
        .DependsOn(NgLibraryBuild)
        .Executes(() =>
        {
            Npm("run test:ci", NgAppDir);
        });

    Target NgLibraryPublish => _ => _
        .DependsOn(NgLibraryBuild)
        .Executes(() =>
        {
            var npmTag = GitVersion.BranchName.Equals("master") || GitVersion.BranchName.Equals("origin/master")
            ? "latest"
            : "next";
            Npm($"publish --access=public --tag={npmTag}", NgAppDir / "dist" / "angular-material-shared");
        });

    Target PublishGitHubRelease => _ => _
        .Requires(() => GitHubAuthenticationToken)
        .OnlyWhenDynamic(() => GitVersion.BranchName.Equals("master") || GitVersion.BranchName.Equals("origin/master"))
        .Executes(async () =>
        {
            var releaseTag = $"v{GitVersion.MajorMinorPatch}";

            var changeLogSectionEntries = ExtractChangelogSectionNotes(ChangeLogFile);
            var latestChangeLog = changeLogSectionEntries
                .Aggregate((c, n) => c + Environment.NewLine + n);
            var completeChangeLog = $"## {releaseTag}" + Environment.NewLine + latestChangeLog;

            var repositoryInfo = GetGitHubRepositoryInfo(GitRepository);

            await PublishRelease(x => x
                    .SetCommitSha(GitVersion.Sha)
                    .SetReleaseNotes(completeChangeLog)
                    .SetRepositoryName(repositoryInfo.repositoryName)
                    .SetRepositoryOwner(repositoryInfo.gitHubOwner)
                    .SetTag(releaseTag)
                    .SetToken(GitHubAuthenticationToken));
        });
}
