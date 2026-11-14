using System.Globalization;

namespace LilyBlazorHeadless.Components;

/// <summary>A unit of an age, in the NHS Common User Interface's age bands.</summary>
public enum AgeUnit { Minutes, Hours, Days, Weeks, Months, Years }

/// <summary>One part of an age.</summary>
public record AgePart(int Value, AgeUnit Unit);

/// <summary>
/// Clinical display formatting (spec/healthcare-ui, P27-T1), the C# port of shared/clinical-format.ts. It decides how a
/// value is written, never what it is: no unit conversion, rounding, scoring or default culture.
/// </summary>
public static class ClinicalFormat
{
    private const char NoBreakSpace = ' ';

    /// <summary>A quantity and its unit: no trailing zero, a leading zero, grouping, a no-break space before the unit.</summary>
    public static string FormatQuantity(decimal value, string unit, CultureInfo culture)
    {
        ArgumentNullException.ThrowIfNull(culture);
        // "#,0.############################" keeps every significant digit and writes no trailing zero.
        var number = value.ToString("#,0.############################", culture);
        return string.IsNullOrEmpty(unit) ? number : $"{number}{NoBreakSpace}{unit}";
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
