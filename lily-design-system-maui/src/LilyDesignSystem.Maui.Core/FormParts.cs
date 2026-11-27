using System.Globalization;
using System.Text.RegularExpressions;

namespace LilyDesignSystem.Maui.Core;

/// <summary>
/// Thrown by <see cref="FormParts"/> for input outside its valid range: never clamped or defaulted. <see cref="Reason"/> is the
/// word the TypeScript module's RangeError carries (precision, order, count, limit or index), as shared/vectors names it.
/// </summary>
public sealed class FormPartsException(string reason, string message) : ArgumentException($"form-parts: {message}")
{
    /// <summary>Which input was invalid.</summary>
    public string Reason { get; } = reason;
}

/// <summary>The three parts of a date as typed; a part the precision does not ask for is "".</summary>
public sealed record DateParts(string Year = "", string Month = "", string Day = "")
{
    /// <summary>The part named "year", "month" or "day".</summary>
    public string this[string part] => part switch
    {
        "year" => Year,
        "month" => Month,
        "day" => Day,
        _ => throw new FormPartsException("precision", $"{part} is not year, month or day"),
    };
}

/// <summary>
/// The C# port of shared/form-parts.ts, proved equal by shared/vectors/form-parts.json (tasks.md P62-T3): the rules of the date
/// field, the quantity input, the repeatable fieldset and the step list. Precisions ("day", "month", "year"), orders ("ymd",
/// "dmy", "mdy") and results are the TypeScript's words. Digits are ASCII 0 to 9.
/// </summary>
public static partial class FormParts
{
    private static readonly Dictionary<string, string[]> Shown = new()
    {
        ["day"] = ["year", "month", "day"],
        ["month"] = ["year", "month"],
        ["year"] = ["year"],
    };

    private static readonly Dictionary<string, string[]> Sequences = new()
    {
        ["ymd"] = ["year", "month", "day"],
        ["dmy"] = ["day", "month", "year"],
        ["mdy"] = ["month", "day", "year"],
    };

    [GeneratedRegex(@"^([0-9]{1,4})(?:-([0-9]{1,2})(?:-([0-9]{1,2}))?)?$")]
    private static partial Regex ValuePattern();

    [GeneratedRegex(@"^([0-9]{4})(?:-([0-9]{2})(?:-([0-9]{2}))?)?$")]
    private static partial Regex CalendarPattern();

    [GeneratedRegex(@"^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$")]
    private static partial Regex NumberPattern();

    private static string[] ShownFor(string precision) =>
        Shown.TryGetValue(precision, out var shown)
            ? shown
            : throw new FormPartsException("precision", $"precision {precision} is not day, month or year");

    /// <summary>The parts a date field asks for at a precision, in ISO 8601 order.</summary>
    public static IReadOnlyList<string> DatePartsShown(string precision) => [.. ShownFor(precision)];

    /// <summary>The parts in the order the reader writes them, leaving out those the precision does not ask for.</summary>
    public static IReadOnlyList<string> DateSequence(string order, string precision)
    {
        if (!Sequences.TryGetValue(order, out var sequence))
            throw new FormPartsException("order", $"order {order} is not ymd, dmy or mdy");
        var shown = ShownFor(precision);
        return [.. sequence.Where(shown.Contains)];
    }

    /// <summary>The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else.</summary>
    public static DateParts SplitDateValue(string value, string precision)
    {
        var shown = ShownFor(precision);
        var m = ValuePattern().Match(value);
        if (!m.Success) return new DateParts();
        var groups = new[] { m.Groups[1], m.Groups[2], m.Groups[3] };
        if (groups.Count(g => g.Success) != shown.Length) return new DateParts();
        return new DateParts(groups[0].Value, groups[1].Value, groups[2].Value);
    }

    /// <summary>The value once every part asked for is a number, padded to ISO 8601, else "".</summary>
    public static string JoinDateParts(DateParts parts, string precision)
    {
        var shown = ShownFor(precision);
        if (!shown.All(p => parts[p].Length > 0 && parts[p].All(c => c is >= '0' and <= '9'))) return "";
        string[] iso = [parts.Year.PadLeft(4, '0'), parts.Month.PadLeft(2, '0'), parts.Day.PadLeft(2, '0')];
        return string.Join("-", iso.Take(shown.Length));
    }

    /// <summary>Whether a value (YYYY, YYYY-MM or YYYY-MM-DD) names a real year, month or day in the Gregorian calendar.</summary>
    public static bool IsCalendarDate(string value)
    {
        var m = CalendarPattern().Match(value);
        if (!m.Success) return false;
        var year = int.Parse(m.Groups[1].Value, CultureInfo.InvariantCulture);
        if (!m.Groups[2].Success) return true;
        var month = int.Parse(m.Groups[2].Value, CultureInfo.InvariantCulture);
        if (month is < 1 or > 12) return false;
        if (!m.Groups[3].Success) return true;
        var day = int.Parse(m.Groups[3].Value, CultureInfo.InvariantCulture);
        var leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        int[] days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return day >= 1 && day <= days[month - 1];
    }

    /// <summary>
    /// What is wrong with a magnitude as typed against its unit's limits ("empty", "not-a-number", "below-minimum",
    /// "above-maximum"), or null when nothing is. The decimal mark is a full stop.
    /// </summary>
    public static string? QuantityProblem(string magnitude, double? min, double? max)
    {
        if (min is { } lo && !double.IsFinite(lo)) throw new FormPartsException("limit", $"min {lo} is not a finite number");
        if (max is { } hi && !double.IsFinite(hi)) throw new FormPartsException("limit", $"max {hi} is not a finite number");
        if (min > max) throw new FormPartsException("limit", $"min {min} is above max {max}");
        var text = magnitude.Trim();
        if (text.Length == 0) return "empty";
        if (!NumberPattern().IsMatch(text)) return "not-a-number";
        var n = double.Parse(text, NumberStyles.Float, CultureInfo.InvariantCulture);
        if (n < min) return "below-minimum";
        if (n > max) return "above-maximum";
        return null;
    }

    /// <summary>Whether a repeatable fieldset may add another item: below its maximum, or always when it has none.</summary>
    public static bool CanAddItem(int count, int? max)
    {
        if (count < 0) throw new FormPartsException("count", $"count {count} is not a whole number of items");
        if (max is null) return true;
        if (max < 0) throw new FormPartsException("limit", $"max {max} is not a whole number");
        return count < max;
    }

    /// <summary>Whether a repeatable fieldset may remove an item: above its minimum.</summary>
    public static bool CanRemoveItem(int count, int min)
    {
        if (count < 0) throw new FormPartsException("count", $"count {count} is not a whole number of items");
        if (min < 0) throw new FormPartsException("limit", $"min {min} is not a whole number");
        return count > min;
    }

    /// <summary>A step's status ("finished", "in-progress", "waiting") from its index and the current step's.</summary>
    public static string StepStatus(int index, int current)
    {
        if (index < 0 || current < 0) throw new FormPartsException("index", $"index {index} or current {current} is not a step");
        return index < current ? "finished" : index == current ? "in-progress" : "waiting";
    }
}
