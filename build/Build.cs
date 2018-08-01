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

[KeyVaultSettings(
    VaultBaseUrlParameterName = nameof(KeyVaultBaseUrl),
    ClientIdParameterName = nameof(KeyVaultClientId),
    ClientSecretParameterName = nameof(KeyVaultClientSecret))]
class Build : NukeBuild
{
    public static int Main() => Execute<Build>(x => x.Clean);

    [Parameter] string KeyVaultBaseUrl;
    [Parameter] string KeyVaultClientId;
    [Parameter] string KeyVaultClientSecret;
    [GitVersion] readonly GitVersion GitVersion;
    [GitRepository] readonly GitRepository GitRepository;

    [KeyVaultSecret] string GitHubAuthenticationToken;

    string ChangeLogFile => RootDirectory / "CHANGELOG.md";

    Target Clean => _ => _
            .Executes(() =>
            {
                DeleteDirectories(GlobDirectories(SourceDirectory, "angular-material-shared-demo/dist"));
                EnsureCleanDirectory(OutputDirectory);
            });

    AbsolutePath NgAppDir => SourceDirectory / "angular-material-shared-demo";

    Target NgLibraryBuild => _ => _
        .DependsOn(Clean)
        .Executes(() =>
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

            await PublishRelease(new GitHubReleaseSettings()
                    .SetCommitSha(GitVersion.Sha)
                    .SetReleaseNotes(completeChangeLog)
                    .SetRepositoryName(repositoryInfo.repositoryName)
                    .SetRepositoryOwner(repositoryInfo.gitHubOwner)
                    .SetTag(releaseTag)
                    .SetToken(GitHubAuthenticationToken));
        });
}
