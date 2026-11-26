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

    [Fact]
    public void HasWords()
    {
        var cases = Cases("clinical-format", "hasWords").ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
        {
            var arg = c.GetProperty("args")[0];
            Assert.Equal(c.GetProperty("expected").GetBoolean(), ClinicalFormat.HasWords(arg.ValueKind == JsonValueKind.Null ? null : arg.GetString()));
        }
    }

    [Fact]
    public void HtmlDuration()
    {
        var cases = Cases("clinical-format", "htmlDuration").ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
        {
            var arg = c.GetProperty("args")[0];
            var got = ClinicalFormat.HtmlDuration(arg.ValueKind == JsonValueKind.Null ? null : arg.GetString());
            var expected = c.GetProperty("expected");
            if (expected.ValueKind == JsonValueKind.Null) Assert.Null(got);
            else
            {
                Assert.NotNull(got);
                Assert.Equal(expected.GetProperty("datetime").GetString(), got.Datetime);
                Assert.Equal(expected.GetProperty("negative").GetBoolean(), got.Negative);
            }
        }
    }

    [Fact]
    public void PartialDatePrecision()
    {
        var cases = Cases("clinical-format", "partialDatePrecision").Where(c => !c.TryGetProperty("throws", out _)).ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
            Assert.Equal(c.GetProperty("expected").GetString(), ClinicalFormat.PartialDatePrecision(c.GetProperty("args")[0].GetString()!).ToString().ToLowerInvariant());
    }
}
