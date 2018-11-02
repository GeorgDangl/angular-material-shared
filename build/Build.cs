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
                DeleteDirectories(GlobDirectories(SourceDirectory, "angular-material-shared-demo/dist"));
                EnsureCleanDirectory(OutputDirectory);
                EnsureCleanDirectory(TinyMceLanguagesDirectory);
            });

    AbsolutePath NgAppDir => SourceDirectory / "angular-material-shared-demo";

    private async Task DownloadTinyMceLanguages()
    {
        var tinyMceLanguagesJson = await Nuke.Common.IO.HttpTasks.HttpDownloadStringAsync("https://www.tiny.cloud/tinymce-services-azure/1/i18n/index");
        var languagesQueryParam = Newtonsoft.Json.Linq.JArray.Parse(tinyMceLanguagesJson)
            .Select(j => (string)j["code"])
            .Aggregate((c, n) => c + "," + n);
        var languagesDownloadUrl = "https://www.tiny.cloud/tinymce-services-azure/1/i18n/download?langs=" + languagesQueryParam;

        using (var zipStream = await new System.Net.Http.HttpClient().GetStreamAsync(languagesDownloadUrl))
        {
            using (var zipArchive = new System.IO.Compression.ZipArchive(zipStream))
            {
                foreach (var entry in zipArchive.Entries)
                {
                    var entryFilename = System.IO.Path.GetFileName(entry.FullName);
                    var destination = System.IO.Path.Combine(TinyMceLanguagesDirectory, entryFilename);
                    using (var entryStream = entry.Open())
                    {
                        using (var destinationFileStream = System.IO.File.Create(destination))
                        {
                            await entryStream.CopyToAsync(destinationFileStream);
                        }
                    }
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
            await DownloadTinyMceLanguages();

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
            Npm("publish --access=public", NgAppDir / "dist" / "angular-material-shared");
        });

    Target PublishGitHubRelease => _ => _
        .Requires(() => GitHubAuthenticationToken)
        .OnlyWhen(() => GitVersion.BranchName.Equals("master") || GitVersion.BranchName.Equals("origin/master"))
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
