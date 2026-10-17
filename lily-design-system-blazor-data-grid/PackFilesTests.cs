// Test support (no tests): finds the monorepo's label pack files. Named *Tests.cs so the package build leaves it out.

using System.Linq;
using LilyDesignSystem.Blazor.Helpers;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

/// <summary>Finds the monorepo's pack files by walking up from the test assembly.</summary>
public static class PackFiles
{
    public static string Directory()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !System.IO.Directory.Exists(Path.Combine(dir.FullName, "shared", "label-packs"))) dir = dir.Parent;
        return dir is null ? throw new DirectoryNotFoundException("shared/label-packs not found above the test assembly") : Path.Combine(dir.FullName, "shared", "label-packs");
    }

    public static LabelPack Load(string locale) => LabelPack.FromJson(File.ReadAllText(Path.Combine(Directory(), locale + ".json")));

    public static IEnumerable<string> Locales() => System.IO.Directory.GetFiles(Directory(), "*.json").Select(f => Path.GetFileNameWithoutExtension(f)).OrderBy(x => x);
}
