# Changelog — CalendarView (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.3.0 — 2026-10-16

- Added an agenda (list) view, ported from the Svelte 0.4.0: `View="CalendarViewMode.Agenda"` lists the days of the shown month that have events as an ordered list (each day a `<time datetime>` heading, then its events as buttons, or your `Day` template); `AgendaEmptyDays` lists every day; `Labels.AgendaView` gates the switcher button and `Labels.AgendaEmpty` the empty-month message. `previous` / `next` step by month and `OnNavigate` reports the month's range.

## 0.2.0 — 2026-10-14

- Added `showWeekNumbers`, `ranges` (marked ranges) and range selection (`selectedRange`, `onRangeSelect`: Shift+arrows extend, Enter confirms, Shift+click picks, Escape clears), ported from the Svelte 0.3.0.
- Added the one-day `day` view, `maxEvents` (`visibleEvents`, `hiddenCount`), event drag-and-drop and Alt+arrow keys (`onEventMove`, `eventProps`), period title, `hideOutsideDays`, `weekendDays` and multiple selection, ported from the Svelte 0.3.0.

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to
Blazor (net10.0). Week, four-week and padded month views; previous/next/today
navigation; APG grid keyboard model with roving tabindex; picked day
(`@bind-SelectedDate`), disabled days (`MinDate`, `MaxDate`, `IsDisabled`), the
`t` shortcut. `View`, `AnchorDate` and `SelectedDate` are bindable;
`OnNavigate`, `OnDayClick` and `OnEventClick` are `EventCallback`s. Day content
is the `Day` `RenderFragment<CalendarDayContext>`; by default a day number plus a
button per titled event.
