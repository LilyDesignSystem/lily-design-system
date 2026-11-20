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

    [Theory]
    [InlineData("<", "<5\u00a0mmol/L")]
    [InlineData("<=", "\u22645\u00a0mmol/L")]
    [InlineData(">=", "\u22655\u00a0mmol/L")]
    [InlineData(">", ">5\u00a0mmol/L")]
    public void FormatQuantity_writes_the_comparator_before_the_number(string comparator, string expected)
    {
        Assert.Equal(expected, ClinicalFormat.FormatQuantity(5m, "mmol/L", CultureInfo.GetCultureInfo("en-GB"), comparator));
    }

    [Fact]
    public void FormatQuantity_writes_the_approximate_comparator_as_almost_equal()
    {
        Assert.Equal("\u22483\u00a0kg", ClinicalFormat.FormatQuantity(3m, "kg", En, "~"));
    }

    [Fact]
    public void FormatQuantity_refuses_an_unknown_comparator()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatQuantity(5m, "mg", CultureInfo.GetCultureInfo("en-GB"), "=~"));
    }

    [Theory]
    [InlineData("2019", "en-GB", "2019")]
    [InlineData("2019-03", "en-GB", "March 2019")]
    [InlineData("2019-03", "de-DE", "März 2019")]
    [InlineData("2019-03-04", "en-GB", "4 March 2019")]
    [InlineData("2019-03-14", "en-US", "March 14, 2019")]
    [InlineData("2019-03-14", "de-DE", "14. März 2019")]
    public void FormatPartialDate_writes_only_the_fields_the_record_has(string iso, string culture, string expected)
    {
        Assert.Equal(expected, ClinicalFormat.FormatPartialDate(iso, CultureInfo.GetCultureInfo(culture)));
    }

    [Theory]
    [InlineData("19")]
    [InlineData("2019-3")]
    [InlineData("2019-13")]
    [InlineData("2019-02-30")]
    [InlineData("2019-03-14T10:00")]
    public void FormatPartialDate_refuses_what_is_not_a_partial_date(string iso)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatPartialDate(iso, En));
    }

    [Fact]
    public void PartialDatePrecision_names_how_much_of_the_date_there_is()
    {
        Assert.Equal(DatePrecision.Year, ClinicalFormat.PartialDatePrecision("2019"));
        Assert.Equal(DatePrecision.Month, ClinicalFormat.PartialDatePrecision("2019-03"));
        Assert.Equal(DatePrecision.Day, ClinicalFormat.PartialDatePrecision("2019-03-14"));
    }

    [Fact]
    public void FormatProportion_writes_each_kind()
    {
        Assert.Equal("1:128", ClinicalFormat.FormatProportion(1, 128, ProportionKind.Ratio, En));
        Assert.Equal("0.5", ClinicalFormat.FormatProportion(0.5m, 1, ProportionKind.Unitary, En));
        Assert.Equal("0,5", ClinicalFormat.FormatProportion(0.5m, 1, ProportionKind.Unitary, De));
        Assert.Equal("45%", ClinicalFormat.FormatProportion(45, 100, ProportionKind.Percent, En));
        Assert.Equal("1/2", ClinicalFormat.FormatProportion(1, 2, ProportionKind.Fraction, En));
        Assert.Equal("2/4", ClinicalFormat.FormatProportion(2, 4, ProportionKind.Fraction, En));
        Assert.Equal("1\u00a01/2", ClinicalFormat.FormatProportion(3, 2, ProportionKind.IntegerFraction, En));
        Assert.Equal("2", ClinicalFormat.FormatProportion(4, 2, ProportionKind.IntegerFraction, En));
    }

    [Fact]
    public void FormatProportion_refuses_a_denominator_the_kind_does_not_allow()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatProportion(1, 0, ProportionKind.Ratio, En));
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatProportion(45, 10, ProportionKind.Percent, En));
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatProportion(1.5m, 2, ProportionKind.Fraction, En));
    }

    [Fact]
    public void HtmlDuration_takes_days_to_seconds_and_returns_the_sign_apart()
    {
        Assert.Equal(new HtmlDurationValue("P3DT4H", false), ClinicalFormat.HtmlDuration("P3DT4H"));
        Assert.Equal(new HtmlDurationValue("P3D", true), ClinicalFormat.HtmlDuration("-P3D"));
        Assert.Null(ClinicalFormat.HtmlDuration("P2Y"));
        Assert.Null(ClinicalFormat.HtmlDuration("P3M"));
        Assert.Null(ClinicalFormat.HtmlDuration("PT"));
        Assert.Null(ClinicalFormat.HtmlDuration("nonsense"));
    }

    [Fact]
    public void FormatRange_writes_low_to_high_with_the_unit_after_the_high_end()
    {
        Assert.Equal("3.5\u20135.5\u00A0mmol/L", ClinicalFormat.FormatRange(3.5m, 5.5m, "mmol/L", En));
        Assert.Equal("3,5\u20135,5\u00A0mmol/L", ClinicalFormat.FormatRange(3.5m, 5.5m, "mmol/L", De));
        Assert.Equal("1,000\u20132,500\u00A0units", ClinicalFormat.FormatRange(1000m, 2500m, "units", En));
        Assert.Equal("1\u20132", ClinicalFormat.FormatRange(1m, 2m, "", En));
    }

    [Fact]
    public void FormatRange_writes_equal_ends_as_one_number_and_spaces_the_dash_for_a_negative_end()
    {
        Assert.Equal("5\u00A0mg", ClinicalFormat.FormatRange(5m, 5m, "mg", En));
        Assert.Equal("-2 \u2013 3\u00A0\u00B0C", ClinicalFormat.FormatRange(-2m, 3m, "\u00B0C", En));
    }

    [Fact]
    public void FormatRange_refuses_a_range_given_backwards()
    {
        var error = Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatRange(2.12m, 1.82m, "", En));
        Assert.Contains("above high", error.Message);
    }
}
