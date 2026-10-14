# LilyDesignSystem.Blazor.Calendar

A headless, accessible calendar for Blazor: week, four-week and month views, previous/next/today,
keyboard navigation, a picked day, disabled days and event buttons. Composes the headless
`CalendarTable` family and the sibling `DateTimePicker`'s civil-date arithmetic. Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.Calendar
```

## Quick start

```razor
@using LilyDesignSystem.Blazor.Helpers

<CalendarView Label="Appointments"
              @bind-View="view"
              @bind-AnchorDate="anchor"
              Today="2026-01-08"
              Events="events"
              Labels="labels"
              OnDayClick="d => picked = d"
              OnEventClick="e => opened = e.Id" />

@code {
    private CalendarViewMode view = CalendarViewMode.Month;
    private string anchor = "2026-01-15";
    private string? picked, opened;
    private readonly IReadOnlyList<CalendarEvent> events = new[]
    {
        new CalendarEvent { Id = "e1", Date = "2026-01-06", Title = "Check-up" },
    };
    private readonly CalendarViewLabels labels = new()
    {
        MonthView = "Month",
        Today = "Today",
        Previous = v => $"Previous {v}",
        Next = v => $"Next {v}",
        WeekdayAbbr = d => new[] { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" }[d],
    };
}
```

## Keyboard

Arrows move the cursor by a day or a week; Home/End go to the row's ends; PageUp/PageDown step by the
view's length; Enter/Space pick the day; `t` goes to today. Disabled days stay focusable but cannot be picked.
