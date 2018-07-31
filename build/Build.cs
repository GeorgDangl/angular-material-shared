using Nuke.Common;
using Nuke.Common.Git;
using Nuke.Common.Tools.GitVersion;
using System.IO;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;
using static Nuke.Common.Tools.Npm.NpmTasks;

class Build : NukeBuild
{
    public static int Main() => Execute<Build>(x => x.Clean);

    [GitVersion] readonly GitVersion GitVersion;
    [GitRepository] readonly GitRepository GitRepository;

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
            Npm("ci", NgAppDir);
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
            Npm("publish", NgAppDir / "dist" / "angular-material-shared");
        });
}
