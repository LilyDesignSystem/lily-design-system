using System.Globalization;

namespace LilyBlazorHeadless.Components;

/// <summary>A unit of an age, in the NHS Common User Interface's age bands.</summary>
public enum AgeUnit { Minutes, Hours, Days, Weeks, Months, Years }

/// <summary>One part of an age.</summary>
public record AgePart(int Value, AgeUnit Unit);

/// <summary>How much of a date a partial ISO 8601 date holds.</summary>
public enum DatePrecision { Year, Month, Day }

/// <summary>An ISO 8601 duration as an HTML datetime value, its sign apart.</summary>
public record HtmlDurationValue(string Datetime, bool Negative);

/// <summary>openEHR PROPORTION_KIND: how a numerator and denominator are written.</summary>
public enum ProportionKind { Ratio, Unitary, Percent, Fraction, IntegerFraction }

/// <summary>
/// Clinical display formatting (spec/healthcare-ui, P27-T1), the C# port of shared/clinical-format.ts. It decides how a
/// value is written, never what it is: no unit conversion, rounding, scoring or default culture.
/// </summary>
public static class ClinicalFormat
{
    private const char NoBreakSpace = ' ';

    /// <summary>A quantity and its unit: no trailing zero, a leading zero, grouping, a no-break space before the unit.</summary>
    public static string FormatQuantity(decimal value, string unit, CultureInfo culture, string? comparator = null)
    {
        ArgumentNullException.ThrowIfNull(culture);
        // "#,0.############################" keeps every significant digit and writes no trailing zero.
        var number = value.ToString("#,0.############################", culture);
        // FHIR Quantity.comparator, plus openEHR's "~": "<5" is not "5", and "about 3 kg" is not "3 kg", so it is never dropped.
        var sign = comparator switch
        {
            null => "",
            "<" => "<",
            "<=" => "\u2264",
            ">=" => "\u2265",
            ">" => ">",
            "~" => "\u2248",
            _ => throw new ArgumentOutOfRangeException(nameof(comparator), comparator, "not a comparator"),
        };
        var written = sign + number;
        return string.IsNullOrEmpty(unit) ? written : $"{written}{NoBreakSpace}{unit}";
    }

    /// <summary>The age at <paramref name="at"/> of someone born at <paramref name="birth"/>, in the CUI unit bands.</summary>
    public static IReadOnlyList<AgePart> AgeParts(DateTimeOffset birth, DateTimeOffset at)
    {
        var elapsed = at - birth;
        if (elapsed < TimeSpan.Zero) throw new ArgumentOutOfRangeException(nameof(at), "at is before birth");
        if (elapsed < TimeSpan.FromHours(2)) return [new((int)elapsed.TotalMinutes, AgeUnit.Minutes)];
        if (elapsed < TimeSpan.FromDays(2)) return [new((int)elapsed.TotalHours, AgeUnit.Hours)];
        var totalDays = (int)elapsed.TotalDays;
        if (totalDays < 28) return [new(totalDays, AgeUnit.Days)];
        var (years, months, days) = CalendarDifference(birth.UtcDateTime, at.UtcDateTime);
        if (years < 1) return [new(totalDays / 7, AgeUnit.Weeks), new(totalDays % 7, AgeUnit.Days)];
        if (years < 2) return [new(years * 12 + months, AgeUnit.Months), new(days, AgeUnit.Days)];
        if (years < 18) return [new(years, AgeUnit.Years), new(months, AgeUnit.Months)];
        return [new(years, AgeUnit.Years)];
    }

    /// <summary>Age parts as an ISO 8601 duration; weeks are written as days.</summary>
    public static string ToIsoDuration(IEnumerable<AgePart> parts)
    {
        int years = 0, months = 0, days = 0, hours = 0, minutes = 0;
        foreach (var part in parts)
        {
            switch (part.Unit)
            {
                case AgeUnit.Years: years += part.Value; break;
                case AgeUnit.Months: months += part.Value; break;
                case AgeUnit.Weeks: days += part.Value * 7; break;
                case AgeUnit.Days: days += part.Value; break;
                case AgeUnit.Hours: hours += part.Value; break;
                default: minutes += part.Value; break;
            }
        }
        var date = $"{(years > 0 ? $"{years}Y" : "")}{(months > 0 ? $"{months}M" : "")}{(days > 0 ? $"{days}D" : "")}";
        var time = $"{(hours > 0 ? $"{hours}H" : "")}{(minutes > 0 ? $"{minutes}M" : "")}";
        if (date.Length == 0 && time.Length == 0) return "PT0M";
        return $"P{date}{(time.Length > 0 ? $"T{time}" : "")}";
    }

    private static (int Year, int? Month, int? Day) ParsePartialDate(string iso)
    {
        ArgumentNullException.ThrowIfNull(iso);
        var match = System.Text.RegularExpressions.Regex.Match(iso, @"^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$");
        if (!match.Success) throw new ArgumentOutOfRangeException(nameof(iso), iso, "not a partial ISO 8601 date");
        var year = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
        int? month = match.Groups[2].Success ? int.Parse(match.Groups[2].Value, CultureInfo.InvariantCulture) : null;
        int? day = match.Groups[3].Success ? int.Parse(match.Groups[3].Value, CultureInfo.InvariantCulture) : null;
        if (year < 1) throw new ArgumentOutOfRangeException(nameof(iso), iso, "not a year");
        if (month is < 1 or > 12) throw new ArgumentOutOfRangeException(nameof(iso), iso, "not a month");
        if (day is not null && (day < 1 || day > DateTime.DaysInMonth(year, month!.Value)))
            throw new ArgumentOutOfRangeException(nameof(iso), iso, "not a calendar date");
        return (year, month, day);
    }

    /// <summary>How precise a partial date (YYYY, YYYY-MM or YYYY-MM-DD) is.</summary>
    public static DatePrecision PartialDatePrecision(string iso)
    {
        var (_, month, day) = ParsePartialDate(iso);
        return day is not null ? DatePrecision.Day : month is not null ? DatePrecision.Month : DatePrecision.Year;
    }

    /// <summary>
    /// A partial date written with only the fields it has (openEHR DV_DATE partial forms, FHIR partial dates): a year, a month
    /// and year, or a full date without the weekday. The month is always a word, never a number, and nothing is invented.
    /// </summary>
    public static string FormatPartialDate(string iso, CultureInfo culture, bool shortMonth = false)
    {
        ArgumentNullException.ThrowIfNull(culture);
        var (year, month, day) = ParsePartialDate(iso);
        var date = new DateTime(year, month ?? 1, day ?? 1, 0, 0, 0, DateTimeKind.Unspecified);
        string pattern;
        if (month is null) pattern = "yyyy";
        else if (day is null) pattern = culture.DateTimeFormat.YearMonthPattern;
        else
        {
            // The culture's long date, without the weekday the record does not state, and without a leading zero on the day.
            pattern = System.Text.RegularExpressions.Regex.Replace(culture.DateTimeFormat.LongDatePattern, @"dddd[,.]?\s*", "");
            pattern = System.Text.RegularExpressions.Regex.Replace(pattern, @"(?<!d)dd(?!d)", "d");
        }
        if (shortMonth) pattern = pattern.Replace("MMMM", "MMM");
        return date.ToString(pattern, culture).Trim();
    }

    /// <summary>
    /// A proportion written as its kind says: "1:128", a unitary value, a percent in the culture's form, "1/2" or "1 1/2".
    /// Nothing is reduced: 2/4 stays 2/4.
    /// </summary>
    public static string FormatProportion(decimal numerator, decimal denominator, ProportionKind kind, CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(culture);
        string Number(decimal value) => value.ToString("#,0.############################", culture);
        switch (kind)
        {
            case ProportionKind.Ratio:
                if (denominator == 0) throw new ArgumentOutOfRangeException(nameof(denominator), "a ratio needs a denominator");
                return $"{Number(numerator)}:{Number(denominator)}";
            case ProportionKind.Unitary:
                if (denominator != 1) throw new ArgumentOutOfRangeException(nameof(denominator), "a unitary proportion has denominator 1");
                return Number(numerator);
            case ProportionKind.Percent:
            {
                if (denominator != 100) throw new ArgumentOutOfRangeException(nameof(denominator), "a percent has denominator 100");
                var format = (NumberFormatInfo)culture.NumberFormat.Clone();
                var text = numerator.ToString(CultureInfo.InvariantCulture);
                format.PercentDecimalDigits = text.Contains('.') ? text.Length - text.IndexOf('.') - 1 : 0;
                return (numerator / 100m).ToString("P", format);
            }
            case ProportionKind.Fraction:
            case ProportionKind.IntegerFraction:
            {
                if (decimal.Truncate(numerator) != numerator || decimal.Truncate(denominator) != denominator || denominator <= 0)
                    throw new ArgumentOutOfRangeException(nameof(denominator), "a fraction needs a whole numerator and a positive whole denominator");
                if (kind == ProportionKind.Fraction) return $"{Number(numerator)}/{Number(denominator)}";
                var sign = numerator < 0 ? "-" : "";
                var whole = decimal.Floor(Math.Abs(numerator) / denominator);
                var rest = Math.Abs(numerator) % denominator;
                if (rest == 0) return sign + Number(whole);
                if (whole == 0) return $"{sign}{Number(rest)}/{Number(denominator)}";
                return $"{sign}{Number(whole)}{NoBreakSpace}{Number(rest)}/{Number(denominator)}";
            }
            default:
                throw new ArgumentOutOfRangeException(nameof(kind), kind, "not a proportion kind");
        }
    }

    /// <summary>
    /// An ISO 8601 duration as an HTML <c>&lt;time datetime&gt;</c> value, or null when it cannot be one: HTML takes only days,
    /// hours, minutes and seconds (a year or a month has no fixed length) and no sign, so the sign is returned apart.
    /// </summary>
    public static HtmlDurationValue? HtmlDuration(string? iso)
    {
        if (string.IsNullOrEmpty(iso)) return null;
        var match = System.Text.RegularExpressions.Regex.Match(iso, @"^(-)?P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$");
        if (!match.Success || !System.Text.RegularExpressions.Regex.IsMatch(iso, @"\d") || iso.EndsWith('T')) return null;
        return new HtmlDurationValue(iso.TrimStart('-'), match.Groups[1].Success);
    }

    private static (int Years, int Months, int Days) CalendarDifference(DateTime birth, DateTime at)
    {
        var years = at.Year - birth.Year;
        var months = at.Month - birth.Month;
        var days = at.Day - birth.Day;
        if (at.TimeOfDay < birth.TimeOfDay) days -= 1;
        if (days < 0)
        {
            months -= 1;
            var previous = new DateTime(at.Year, at.Month, 1).AddMonths(-1);
            days += DateTime.DaysInMonth(previous.Year, previous.Month);
        }
        if (months < 0)
        {
            years -= 1;
            months += 12;
        }
        return (years, months, days);
    }
}
