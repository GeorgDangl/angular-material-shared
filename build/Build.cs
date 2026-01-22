using Nuke.Common;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tools.AzureKeyVault;
using Nuke.Common.Tools.GitVersion;
using Nuke.Common.Utilities.Collections;
using Nuke.GitHub;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static Nuke.Common.ChangeLog.ChangelogTasks;
using static Nuke.Common.IO.PathConstruction;
using static Nuke.Common.Tools.Npm.NpmTasks;
using static Nuke.GitHub.GitHubTasks;

class Build : NukeBuild
{
    public static int Main() => Execute<Build>(x => x.Clean);

    [AzureKeyVaultConfiguration(
        BaseUrlParameterName = nameof(KeyVaultBaseUrl),
        ClientIdParameterName = nameof(KeyVaultClientId),
        ClientSecretParameterName = nameof(KeyVaultClientSecret),
        TenantIdParameterName = nameof(KeyVaultTenantId))]
    readonly AzureKeyVaultConfiguration KeyVaultSettings;

    [Parameter] string KeyVaultBaseUrl;
    [Parameter] string KeyVaultClientId;
    [Parameter] string KeyVaultClientSecret;
    [Parameter] string KeyVaultTenantId;
    [GitVersion(Framework = "netcoreapp3.1")] readonly GitVersion GitVersion;
    [GitRepository] readonly GitRepository GitRepository;

    [AzureKeyVaultSecret] string GitHubAuthenticationToken;
    [AzureKeyVaultSecret("NpmDanglJenkinsAccessToken")] string NpmDanglJenkinsAccessToken;

    [Solution("angular-material-shared.sln")] readonly Solution Solution;
    AbsolutePath SolutionDirectory => Solution.Directory;
    AbsolutePath OutputDirectory => SolutionDirectory / "output";
    AbsolutePath SourceDirectory => SolutionDirectory / "src";
    AbsolutePath TinyMceAssetsDirectory => NgAppDir / "dist" / "angular-material-shared" / "tinymce-assets";
    string ChangeLogFile => RootDirectory / "CHANGELOG.md";

    Target Clean => _ => _
            .Executes(() =>
            {
                SourceDirectory.GlobDirectories("angular-material-shared-demo/dist").ForEach(d => d.DeleteDirectory());
                OutputDirectory.CreateOrCleanDirectory();
                TinyMceAssetsDirectory.CreateOrCleanDirectory();
            });

    AbsolutePath NgAppDir => SourceDirectory / "angular-material-shared-demo";

    Target CopyTinyMceAssetsToDemoApp => _ => _
        .Executes(async () =>
        {
            await CopyTinyMceAssetsToDist();
            TinyMceAssetsDirectory.Copy(SourceDirectory / "angular-material-shared-demo" / "src" / "assets" / "tinymce-assets");
        });

    private async Task CopyTinyMceAssetsToDist()
    {
        (NgAppDir / "dist" / "angular-material-shared").CreateDirectory();
        TinyMceAssetsDirectory.CreateOrCleanDirectory();
        (TinyMceAssetsDirectory / "langs").CreateOrCleanDirectory();
        var languageFiles = (NgAppDir / "node_modules" / "tinymce-i18n" / "langs5").GlobFiles("*.js");
        Assert.NotEmpty(languageFiles, "No TinyMCE language files found to copy!");
        foreach (var languageFile in languageFiles)
        {
            var fileName = Path.GetFileName(languageFile);
            var destinationPath = Path.Combine(TinyMceAssetsDirectory / "langs", fileName);
            using (var sourceStream = File.OpenRead(languageFile))
            {
                using (var destinationFileStream = System.IO.File.Create(destinationPath))
                {
                    await sourceStream.CopyToAsync(destinationFileStream);
                }
            }
        }

        var tinyMceAssetFolders = new[] { "icons", "plugins", "skins", "themes", "models" };
        foreach (var tinyMceAssetFolder in tinyMceAssetFolders)
        {
            (NgAppDir / "node_modules" / "tinymce" / tinyMceAssetFolder).Copy(TinyMceAssetsDirectory / tinyMceAssetFolder);
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
            await CopyTinyMceAssetsToDist();

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
        .Requires(() => NpmDanglJenkinsAccessToken)
        .OnlyWhenDynamic(() => Nuke.Common.CI.Jenkins.Jenkins.Instance == null
            || Nuke.Common.CI.Jenkins.Jenkins.Instance.ChangeId == null)
        .Executes(() =>
        {
            var npmTag = GitVersion.BranchName.Equals("master") || GitVersion.BranchName.Equals("origin/master")
            ? "latest"
            : "next";
            (NgAppDir / "dist" / "angular-material-shared" / ".npmrc").WriteAllText($@"
registry=https://registry.npmjs.org/
always-auth=true
//registry.npmjs.org/:_authToken={NpmDanglJenkinsAccessToken}
");
            Npm($"publish --access=public --tag={npmTag}", NgAppDir / "dist" / "angular-material-shared");
            (NgAppDir / "dist" / "angular-material-shared" / ".npmrc").DeleteFile();
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
