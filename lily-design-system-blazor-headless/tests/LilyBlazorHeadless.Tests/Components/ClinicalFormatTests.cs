using System.Globalization;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ClinicalFormatTests
{
    private static readonly CultureInfo En = CultureInfo.GetCultureInfo("en-GB");
    private static readonly CultureInfo De = CultureInfo.GetCultureInfo("de-DE");

    [Fact]
    public void FormatQuantity_writes_no_trailing_zero_a_leading_zero_and_grouping()
    {
        Assert.Equal("5 mg", ClinicalFormat.FormatQuantity(5.0m, "mg", En));
        Assert.Equal("0.5 mg", ClinicalFormat.FormatQuantity(0.5m, "mg", En));
        Assert.Equal("5,000 units", ClinicalFormat.FormatQuantity(5000m, "units", En));
        Assert.Equal("0,5 mg", ClinicalFormat.FormatQuantity(0.5m, "mg", De));
        Assert.Equal("0.0625 mg", ClinicalFormat.FormatQuantity(0.0625m, "mg", En));
        Assert.Equal("7", ClinicalFormat.FormatQuantity(7m, "", En));
    }

    [Theory]
    [InlineData("2026-01-10T08:00:00Z", "2026-01-10T09:59:00Z", "119 Minutes")]
    [InlineData("2026-01-10T08:00:00Z", "2026-01-10T10:00:00Z", "2 Hours")]
    [InlineData("2026-01-10T08:00:00Z", "2026-01-12T08:00:00Z", "2 Days")]
    [InlineData("2026-01-10T08:00:00Z", "2026-04-20T08:00:00Z", "14 Weeks 2 Days")]
    [InlineData("2024-03-15T00:00:00Z", "2026-03-14T00:00:00Z", "23 Months 27 Days")]
    [InlineData("2008-11-20T00:00:00Z", "2026-11-19T00:00:00Z", "17 Years 11 Months")]
    [InlineData("2008-11-20T00:00:00Z", "2026-11-20T00:00:00Z", "18 Years")]
    public void AgeParts_uses_the_cui_bands(string birth, string at, string expected)
    {
        var parts = ClinicalFormat.AgeParts(DateTimeOffset.Parse(birth, CultureInfo.InvariantCulture), DateTimeOffset.Parse(at, CultureInfo.InvariantCulture));
        Assert.Equal(expected, string.Join(" ", parts.Select(p => $"{p.Value} {p.Unit}")));
    }

    [Fact]
    public void ToIsoDuration_writes_each_band()
    {
        Assert.Equal("P23D", ClinicalFormat.ToIsoDuration([new(3, AgeUnit.Weeks), new(2, AgeUnit.Days)]));
        Assert.Equal("P5Y2M", ClinicalFormat.ToIsoDuration([new(5, AgeUnit.Years), new(2, AgeUnit.Months)]));
        Assert.Equal("PT90M", ClinicalFormat.ToIsoDuration([new(90, AgeUnit.Minutes)]));
        Assert.Equal("PT0M", ClinicalFormat.ToIsoDuration([new(0, AgeUnit.Minutes)]));
    }
}
