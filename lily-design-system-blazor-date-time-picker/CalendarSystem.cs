using System.Globalization;

namespace LilyDesignSystem.Blazor.Helpers;

/// <summary>
/// Month grids in a CLDR calendar, the .NET twin of <c>shared/calendar-system.ts</c>. Every date in and out is ISO
/// Gregorian; a month is named by the ISO date of its first day. Blazor has no <c>Intl</c>, so this supports what .NET
/// ships: <c>gregory</c>, <c>persian</c>, <c>islamic</c>, <c>islamic-civil</c>, <c>islamic-umalqura</c>,
/// <c>buddhist</c> and <c>hebrew</c>. Spec: spec/date-time-picker/index.md#calendar-systems.
/// </summary>
public static class CalendarSystem
{
    /// <summary>The .NET calendar for a CLDR id. An unknown id is an error, never a silent Gregorian grid.</summary>
    public static Calendar For(string? id) => id switch
    {
        null or "" or "gregory" => new GregorianCalendar(),
        "persian" => new PersianCalendar(),
        "islamic" or "islamic-civil" => new HijriCalendar(),
        "islamic-umalqura" => new UmAlQuraCalendar(),
        "buddhist" => new ThaiBuddhistCalendar(),
        "hebrew" => new HebrewCalendar(),
        _ => throw new ArgumentException($"DateTimePicker: unsupported calendar \"{id}\"", nameof(id)),
    };

    private static DateTime Date(string iso) => DateTime.ParseExact(iso, "yyyy-MM-dd", CultureInfo.InvariantCulture);

    private static string Iso(DateTime date) => date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    public static int Day(string iso, string? calendar) => For(calendar).GetDayOfMonth(Date(iso));

    public static string MonthStart(string iso, string? calendar) => Iso(Date(iso).AddDays(1 - Day(iso, calendar)));

    public static int MonthLength(string start, string? calendar)
    {
        var date = Date(start);
        var system = For(calendar);
        return system.GetDaysInMonth(system.GetYear(date), system.GetMonth(date));
    }

    public static string AddMonths(string start, int delta, string? calendar)
    {
        var month = start;
        for (var i = 0; i < delta; i++) month = Iso(Date(month).AddDays(MonthLength(month, calendar)));
        for (var i = 0; i > delta; i--) month = MonthStart(Iso(Date(month).AddDays(-1)), calendar);
        return month;
    }

    public static string[][] MonthMatrix(string start, int firstDayOfWeek, string? calendar)
    {
        var date = Date(start);
        date = date.AddDays(-(((int)date.DayOfWeek - firstDayOfWeek + 7) % 7));
        var rows = new string[6][];
        for (var row = 0; row < 6; row++)
        {
            rows[row] = new string[7];
            for (var column = 0; column < 7; column++)
            {
                rows[row][column] = Iso(date);
                date = date.AddDays(1);
            }
        }
        return rows;
    }

    /// <summary>
    /// A culture formatting in the calendar, when .NET offers it for that culture (Persian for fa-IR, Thai Buddhist for
    /// th-TH), or null. With null, the caller shows a numeric "year-month" rather than another calendar's month name.
    /// </summary>
    public static CultureInfo? CultureFor(string? locale, string? calendar)
    {
        if (string.IsNullOrEmpty(locale)) return null;
        try
        {
            var culture = (CultureInfo)new CultureInfo(locale, useUserOverride: false).Clone();
            var system = For(calendar);
            foreach (var option in culture.OptionalCalendars)
            {
                if (option.GetType() == system.GetType())
                {
                    culture.DateTimeFormat.Calendar = option;
                    return culture;
                }
            }
        }
        catch (CultureNotFoundException)
        {
        }
        return null;
    }

    /// <summary>The month shown, as text: in the calendar's own words where .NET can, otherwise "2569-02".</summary>
    public static string Heading(string start, string? locale, string? calendar)
    {
        var date = Date(start);
        var culture = CultureFor(locale, calendar);
        if (culture is not null) return date.ToString("Y", culture);
        var system = For(calendar);
        return $"{system.GetYear(date):D4}-{system.GetMonth(date):D2}";
    }
}
