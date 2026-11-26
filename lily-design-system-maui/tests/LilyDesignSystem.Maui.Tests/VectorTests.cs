using System.Text.Json;
using LilyDesignSystem.Maui.Core;

namespace LilyDesignSystem.Maui.Tests;

// The MAUI core against shared/vectors, the cases every platform's port must agree on (tasks.md P43-T3).
public class VectorTests
{
    private static IEnumerable<JsonElement> Cases(string module, string fn)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "vectors", $"{module}.json");
        using var doc = JsonDocument.Parse(File.ReadAllText(path));
        return doc.RootElement.GetProperty("cases").EnumerateArray()
            .Where(c => c.GetProperty("fn").GetString() == fn)
            .Select(c => c.Clone())
            .ToList();
    }

    [Fact]
    public void IpsSectionCodes()
    {
        var cases = Cases("ips-sections", "ipsSectionCode").ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
        {
            var key = c.GetProperty("args")[0].GetString()!;
            var expected = c.GetProperty("expected");
            Assert.Equal(expected.ValueKind == JsonValueKind.Null ? null : expected.GetString(), IpsSections.Code(key));
        }
    }

    [Fact]
    public void IpsSectionIsRequired()
    {
        var cases = Cases("ips-sections", "ipsSectionIsRequired").ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
            Assert.Equal(c.GetProperty("expected").GetBoolean(), IpsSections.IsRequired(c.GetProperty("args")[0].GetString()!));
    }

    [Fact]
    public void IpsMissingRequired()
    {
        var cases = Cases("ips-sections", "ipsMissingRequired").ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
        {
            var sections = c.GetProperty("args")[0].EnumerateArray()
                .Select(s => new IpsSectionEntry(s.GetProperty("key").GetString()!, "", "known", null))
                .ToList();
            var expected = c.GetProperty("expected").EnumerateArray().Select(e => e.GetString()!).ToList();
            Assert.Equal(expected, IpsSections.MissingRequired(sections));
        }
    }
}
