using System.Threading.Tasks;
using Bunit;
using LilyDesignSystem.Blazor.Helpers;
using Microsoft.AspNetCore.Components.Web;
using Xunit;

namespace LilyDesignSystem.Blazor.Helpers.Tests;

public class DateTimePickerCalendarTests : TestContext
{
    private static readonly DateTimePickerLabels Labels = new()
    {
        PreviousYear = "PrevYear", PreviousMonth = "PrevMonth", PreviousWeek = "PrevWeek", PreviousDay = "PrevDay",
        NextDay = "NextDay", NextWeek = "NextWeek", NextMonth = "NextMonth", NextYear = "NextYear",
        Confirm = "Commit", Cancel = "Dismiss",
    };

    private async Task<IRenderedComponent<DateTimePicker>> OpenOn(string calendar, string value, string locale)
    {
        JSInterop.Mode = JSRuntimeMode.Loose;
        var cut = RenderComponent<DateTimePicker>(p => p
            .Add(x => x.Label, "Date").Add(x => x.Name, "d").Add(x => x.Labels, Labels)
            .Add(x => x.Locale, locale).Add(x => x.CalendarId, calendar).Add(x => x.Value, value));
        await cut.Find("button.date-time-picker-button").ClickAsync(new MouseEventArgs());
        return cut;
    }

    private static string Day(IRenderedComponent<DateTimePicker> cut, string date)
        => cut.Find($"[data-date='{date}']").TextContent.Trim();

    private static bool Outside(IRenderedComponent<DateTimePicker> cut, string date)
        => cut.Find($"[data-date='{date}']").HasAttribute("data-outside");

    [Fact]
    public async Task Persian_month_starts_on_1_Farvardin()
    {
        var cut = await OpenOn("persian", "2025-03-21", "fa-IR");
        Assert.Equal("1", Day(cut, "2025-03-21"));
        Assert.False(Outside(cut, "2025-03-21"));
        Assert.True(Outside(cut, "2025-03-20"));
        Assert.Contains("فروردین", cut.Find(".date-time-picker-period").TextContent);
    }

    [Fact]
    public async Task Islamic_month_starts_on_1_Ramadan_1447()
    {
        var cut = await OpenOn("islamic-umalqura", "2026-02-18", "en");
        Assert.Equal("1", Day(cut, "2026-02-18"));
        Assert.False(Outside(cut, "2026-02-18"));
        Assert.Contains("1447", cut.Find(".date-time-picker-period").TextContent);
    }

    [Fact]
    public async Task Buddhist_year_on_Gregorian_months()
    {
        var cut = await OpenOn("buddhist", "2026-02-14", "en");
        Assert.Equal("14", Day(cut, "2026-02-14"));
        Assert.Contains("2569", cut.Find(".date-time-picker-period").TextContent);
    }

    [Fact]
    public void An_unknown_calendar_is_an_error_not_a_Gregorian_grid()
        => Assert.Throws<System.ArgumentException>(() => CalendarSystem.For("martian"));

    [Fact]
    public void Paging_forward_and_back_returns_to_the_same_month()
    {
        foreach (var calendar in new[] { "persian", "islamic-umalqura", "hebrew", "buddhist" })
        {
            var start = CalendarSystem.MonthStart("2026-03-01", calendar);
            Assert.Equal(start, CalendarSystem.AddMonths(CalendarSystem.AddMonths(start, 14, calendar), -14, calendar));
        }
    }
}
