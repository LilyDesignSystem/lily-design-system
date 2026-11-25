using System.Globalization;
using LilyBlazorHeadless.Components;
using Xunit;

namespace LilyBlazorHeadless.Tests.Components;

public class ClinicalFormatTests
{
    private static readonly CultureInfo En = CultureInfo.GetCultureInfo("en-GB");
    private static readonly CultureInfo De = CultureInfo.GetCultureInfo("de-DE");

    // HC-F1, HC-F2, HC-F3 (spec/healthcare-ui/requirements.md)
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

    // HC-F14 (spec/healthcare-ui/requirements.md)
    [Theory]
    [InlineData("2026-01-10T08:00:00Z", "2026-01-10T09:59:00Z", "119 Minutes")]
    [InlineData("2026-01-10T08:00:00Z", "2026-01-10T10:00:00Z", "2 Hours")]
    [InlineData("2026-01-10T08:00:00Z", "2026-01-12T08:00:00Z", "2 Days")]
    [InlineData("2026-01-10T08:00:00Z", "2026-04-20T08:00:00Z", "14 Weeks 2 Days")]
    [InlineData("2024-03-15T00:00:00Z", "2026-03-14T00:00:00Z", "23 Months 27 Days")]
    [InlineData("2008-11-20T00:00:00Z", "2026-11-19T00:00:00Z", "17 Years 11 Months")]
    [InlineData("2008-11-20T00:00:00Z", "2026-11-20T00:00:00Z", "18 Years")]
    [InlineData("2025-01-31T00:00:00Z", "2026-03-01T00:00:00Z", "13 Months 1 Days")]
    [InlineData("2025-01-31T10:00:00Z", "2026-02-28T09:00:00Z", "12 Months 27 Days")]
    public void AgeParts_uses_the_cui_bands(string birth, string at, string expected)
    {
        var parts = ClinicalFormat.AgeParts(DateTimeOffset.Parse(birth, CultureInfo.InvariantCulture), DateTimeOffset.Parse(at, CultureInfo.InvariantCulture));
        Assert.Equal(expected, string.Join(" ", parts.Select(p => $"{p.Value} {p.Unit}")));
    }

    // HC-F16 (spec/healthcare-ui/requirements.md)
    [Theory]
    [InlineData("2026-01-01", "2026-01-01", "0 Days")]
    [InlineData("2026-01-01", "2026-01-02T23:59:00Z", "1 Days")]
    [InlineData("2026-01-01T23:50:00Z", "2026-01-02", "1 Days")]
    [InlineData("2026-01-01", "2026-01-03T01:00:00+13:00", "2 Days")]
    [InlineData("2026-01-01", "2026-01-29", "4 Weeks 0 Days")]
    [InlineData("2026-01-01T23:30:00+02:00", "2026-01-01T22:30:00Z", "60 Minutes")]
    [InlineData("2025-03-15", "2026-06-01", "14 Months 17 Days")]
    public void AgeParts_from_text_never_gives_hours_from_a_date_alone(string birth, string at, string expected)
        => Assert.Equal(expected, string.Join(" ", ClinicalFormat.AgeParts(birth, at).Select(p => $"{p.Value} {p.Unit}")));

    // HC-F16 (spec/healthcare-ui/requirements.md)
    [Theory]
    [InlineData("2025")]
    [InlineData("2025-03")]
    [InlineData("2026-01-01T10:00")]
    [InlineData("2026-02-30")]
    [InlineData("2026-02-30T10:00:00Z")]
    [InlineData("2026-01-01T24:00:00Z")]
    [InlineData("2026-01-01\n")]
    [InlineData("")]
    public void AgeParts_refuses_a_date_that_has_no_age_without_its_value(string bad)
    {
        var error = Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.AgeParts(bad, "2027-01-01"));
        Assert.Null(error.ActualValue);
        if (bad.Length > 0) Assert.DoesNotContain(bad, error.Message);
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.AgeParts("2024-01-01", bad));
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.AgeParts("2026-01-02", "2026-01-01"));
    }

    [Fact]
    public void ToIsoDuration_writes_each_band()
    {
        Assert.Equal("P23D", ClinicalFormat.ToIsoDuration([new(3, AgeUnit.Weeks), new(2, AgeUnit.Days)]));
        Assert.Equal("P5Y2M", ClinicalFormat.ToIsoDuration([new(5, AgeUnit.Years), new(2, AgeUnit.Months)]));
        Assert.Equal("PT90M", ClinicalFormat.ToIsoDuration([new(90, AgeUnit.Minutes)]));
        Assert.Equal("PT0M", ClinicalFormat.ToIsoDuration([new(0, AgeUnit.Minutes)]));
        Assert.Equal("PT0M", ClinicalFormat.ToIsoDuration([]));
        Assert.Equal("P0D", ClinicalFormat.ToIsoDuration([new(0, AgeUnit.Days)]));
    }

    // HC-F5 (spec/healthcare-ui/requirements.md)
    [Theory]
    [InlineData("<", "<5\u00a0mmol/L")]
    [InlineData("<=", "\u22645\u00a0mmol/L")]
    [InlineData(">=", "\u22655\u00a0mmol/L")]
    [InlineData(">", ">5\u00a0mmol/L")]
    public void FormatQuantity_writes_the_comparator_before_the_number(string comparator, string expected)
    {
        Assert.Equal(expected, ClinicalFormat.FormatQuantity(5m, "mmol/L", CultureInfo.GetCultureInfo("en-GB"), comparator));
    }

    // HC-F5 (spec/healthcare-ui/requirements.md)
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

    // HC-F9 (spec/healthcare-ui/requirements.md)
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

    // HC-F7 (spec/healthcare-ui/requirements.md)
    [Fact]
    public void FormatRange_refuses_a_range_given_backwards()
    {
        var error = Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatRange(2.12m, 1.82m, "", En));
        Assert.Contains("above high", error.Message);
    }

    [Fact]
    public void ToIsoDuration_writes_hours_in_the_time_part()
    {
        Assert.Equal("PT3H", ClinicalFormat.ToIsoDuration([new(3, AgeUnit.Hours)]));
        Assert.Equal("P1DT6H30M", ClinicalFormat.ToIsoDuration([new(1, AgeUnit.Days), new(6, AgeUnit.Hours), new(30, AgeUnit.Minutes)]));
    }

    [Fact]
    public void FormatProportion_refuses_a_kind_that_is_not_a_proportion()
    {
        var error = Assert.Throws<ArgumentOutOfRangeException>(
            () => ClinicalFormat.FormatProportion(1, 2, (ProportionKind)99, CultureInfo.InvariantCulture));
        Assert.Equal("kind", error.ParamName);
    }

    [Fact]
    public void MeterScale_a_two_sided_range_runs_half_a_range_beyond_each_end()
        => Assert.Equal(new MeterScaleResult(2.5, 6.5, 3.5, 5.5), ClinicalFormat.MeterScale(5.2, 3.5, 5.5));

    [Fact]
    public void MeterScale_a_one_sided_range_runs_from_zero_to_half_as_far_again()
    {
        Assert.Equal(new MeterScaleResult(0, 7.5, null, 5), ClinicalFormat.MeterScale(3, null, 5));
        Assert.Equal(new MeterScaleResult(0, 90, 60, null), ClinicalFormat.MeterScale(70, 60));
    }

    [Fact]
    public void MeterScale_is_always_wide_enough_to_hold_the_value()
    {
        Assert.Equal(new MeterScaleResult(2.5, 9, 3.5, 5.5), ClinicalFormat.MeterScale(9, 3.5, 5.5));
        Assert.Equal(new MeterScaleResult(-1, 6.5, 3.5, 5.5), ClinicalFormat.MeterScale(-1, 3.5, 5.5));
        Assert.Equal(new MeterScaleResult(0, 20, null, 5), ClinicalFormat.MeterScale(20, null, 5));
        Assert.Equal(new MeterScaleResult(-2, 7.5, null, 5), ClinicalFormat.MeterScale(-2, null, 5));
    }

    [Fact]
    public void MeterScale_scales_a_negative_two_sided_range_the_same_way()
        => Assert.Equal(new MeterScaleResult(-5, -1, -4, -2), ClinicalFormat.MeterScale(-3, -4, -2));

    [Fact]
    public void MeterScale_draws_nothing_and_throws_nothing_when_there_is_nothing_to_draw()
    {
        Assert.Null(ClinicalFormat.MeterScale(null, 3.5, 5.5));
        Assert.Null(ClinicalFormat.MeterScale(5));
        Assert.Null(ClinicalFormat.MeterScale(5, null, null));
    }

    private static string Reason(Action act) => Assert.Throws<MeterScaleException>(act).Reason;

    [Fact]
    public void MeterScale_throws_for_a_value_that_is_not_a_finite_number()
    {
        Assert.Equal("value", Reason(() => ClinicalFormat.MeterScale(double.NaN, 3.5, 5.5)));
        Assert.Equal("value", Reason(() => ClinicalFormat.MeterScale(double.PositiveInfinity, 3.5, 5.5)));
    }

    [Fact]
    public void MeterScale_throws_for_an_end_that_is_given_but_not_a_finite_number()
    {
        Assert.Equal("range", Reason(() => ClinicalFormat.MeterScale(5, double.NaN, 5.5)));
        Assert.Equal("range", Reason(() => ClinicalFormat.MeterScale(5, 3.5, double.PositiveInfinity)));
        Assert.Equal("range", Reason(() => ClinicalFormat.MeterScale(5, null, double.NaN)));
    }

    [Fact]
    public void MeterScale_throws_for_a_reversed_or_zero_width_range_or_a_bound_not_above_zero()
    {
        Assert.Equal("reversed", Reason(() => ClinicalFormat.MeterScale(5, 5.5, 3.5)));
        Assert.Equal("reversed", Reason(() => ClinicalFormat.MeterScale(5, 4, 4)));
        Assert.Equal("bound", Reason(() => ClinicalFormat.MeterScale(1, null, 0)));
        Assert.Equal("bound", Reason(() => ClinicalFormat.MeterScale(1, null, -3)));
        Assert.Equal("bound", Reason(() => ClinicalFormat.MeterScale(1, 0)));
        Assert.Equal("bound", Reason(() => ClinicalFormat.MeterScale(1, -3)));
    }

    [Fact]
    public void MeterScale_exception_is_an_ArgumentOutOfRangeException_that_names_the_rule_not_the_value()
    {
        var error = Assert.Throws<MeterScaleException>(() => ClinicalFormat.MeterScale(5, 5.5, 3.5));
        Assert.IsAssignableFrom<ArgumentOutOfRangeException>(error);
        Assert.Contains("reversed or has no width", error.Message);
        Assert.DoesNotContain("5.5", error.Message);
        Assert.Null(error.ActualValue);
    }

    // spec/lessons/openehr-rust item 1: an exception reaches logs and error trackers, so it never carries a clinical value.
    public static TheoryData<string, Action> ValueBearingErrors => new()
    {
        { "FormatRange backwards", () => ClinicalFormat.FormatRange(987654.321m, 1m, "mg", En) },
        { "MeterScale reversed", () => ClinicalFormat.MeterScale(987654.321, 987654.321, 1) },
        { "MeterScale one-sided bound", () => ClinicalFormat.MeterScale(987654.321, -987654.321, null) },
        { "MeterScale non-finite end", () => ClinicalFormat.MeterScale(987654.321, double.NaN, 987654.321) },
        { "MeterScale both units", () => ClinicalFormat.MeterScale(5, 3, 6, "SYNTHETIC-A-54", "SYNTHETIC-B-54") },
        { "AgeParts partial birth", () => ClinicalFormat.AgeParts("1987", "2026-01-01") },
        { "FormatPartialDate bad day", () => ClinicalFormat.FormatPartialDate("1987-06-54", En) },
        { "FormatPartialDate bad month", () => ClinicalFormat.FormatPartialDate("1987-54", En) },
        { "FormatPartialDate not a date", () => ClinicalFormat.FormatPartialDate("1987/06/01", En) },
    };

    // HC-F8 (spec/healthcare-ui/requirements.md)
    [Theory]
    [MemberData(nameof(ValueBearingErrors))]
    public void Errors_never_echo_a_clinical_value(string name, Action act)
    {
        var error = Assert.ThrowsAny<ArgumentException>(act);
        Assert.False(error.Message.Contains("987654") || error.Message.Contains("1987") || error.Message.Contains("54"), name);
    }

    [Fact]
    public void MeterScale_refuses_two_different_units_but_not_a_unit_left_out()
    {
        Assert.Equal("units", Reason(() => ClinicalFormat.MeterScale(5, 3.5, 5.5, "mmol/L", "mg/dL")));
        var scale = new MeterScaleResult(2.5, 6.5, 3.5, 5.5);
        Assert.Equal(scale, ClinicalFormat.MeterScale(5, 3.5, 5.5, "mmol/L", "mmol/L"));
        Assert.Equal(scale, ClinicalFormat.MeterScale(5, 3.5, 5.5, "mmol/L"));
        Assert.Equal(scale, ClinicalFormat.MeterScale(5, 3.5, 5.5, null, "mg/dL"));
        Assert.Equal(scale, ClinicalFormat.MeterScale(5, 3.5, 5.5, "", "mg/dL"));
    }

    // spec/lessons/openehr-rust item 2: a result keeps the places reported; a dose (no precision) never has a trailing zero.
    // HC-F6 (spec/healthcare-ui/requirements.md)
    [Fact]
    public void FormatQuantity_with_precision_keeps_the_places_reported()
    {
        Assert.Equal("1.50\u00a0mmol/L", ClinicalFormat.FormatQuantity(1.5m, "mmol/L", En, null, 2));
        Assert.Equal("<5,0\u00a0mmol/L", ClinicalFormat.FormatQuantity(5m, "mmol/L", CultureInfo.GetCultureInfo("de-DE"), "<", 1));
        Assert.Equal("1.5\u00a0mg", ClinicalFormat.FormatQuantity(1.5m, "mg", En));
        Assert.Equal("3.50\u20135.00\u00a0mmol/L", ClinicalFormat.FormatRange(3.5m, 5m, "mmol/L", En, 2));
    }

    [Fact]
    public void FormatQuantity_refuses_a_value_finer_than_its_precision_and_a_bad_precision()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatQuantity(1.55m, "", En, null, 1));
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatQuantity(1m, "", En, null, -1));
        Assert.Throws<ArgumentOutOfRangeException>(() => ClinicalFormat.FormatQuantity(1m, "", En, null, 21));
    }

    // spec/lessons/openehr-rust item 3: ISO 8601 and openEHR allow "," as the decimal sign; HTML takes only ".".
    // HC-F12 (spec/healthcare-ui/requirements.md)
    [Fact]
    public void HtmlDuration_accepts_a_comma_decimal_sign_and_writes_a_point()
    {
        Assert.Equal(new HtmlDurationValue("PT1.5S", false), ClinicalFormat.HtmlDuration("PT1,5S"));
        Assert.Null(ClinicalFormat.HtmlDuration("PT1,S"));
    }
}
