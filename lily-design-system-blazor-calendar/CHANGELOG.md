# Changelog — CalendarView (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.6.0 — 2026-10-17

- Added search: `Labels.Search` renders a field and `SearchValue` (bindable) keeps the events whose title and field text contain every typed word, in any order, ignoring case and diacritics; Escape clears it; `Labels.SearchAnnouncement`. The field carries the headless `search-input` class (written by hand, not composed).
- Added `EventCompare`, which orders a day's events (stable).
- Added copy to the clipboard: `Labels.Copy` (needs `ExportHeaders`), `Labels.CopyAnnouncement`, `Labels.CopyFailed`, `OnCopy`, `CopyHandler` (return `false` to take over).
- Added right-to-left arrow keys through the `Direction` parameter (Blazor cannot read the DOM's `dir` without JS interop, so the consumer says); Alt+Arrow event moves follow the arrow.
- Added field `Validate` messages (`Labels.EditRefused`, `aria-invalid` on the open editor, cleared when the person types) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y, in the grid and in the agenda list) through `OnFieldEdit`, with `Labels.FieldUndoAnnouncement` / `FieldRedoAnnouncement`.
- Not yet ported from the Svelte package: filter, `agendaBelow` / `agendaDate`, range labels as text, composition from the headless layer.

## 0.5.0 — 2026-10-16

- Added typed event fields (`EventFields` as `DataGridColumn`s, `event.Values`, `Locale`), using the data grid's cell types, shown after each event's title in the agenda (editing is agenda-only).
- Added inline field editing (`OnFieldEdit`, each field's `Editable`): click a value; typed editors, Enter / Escape / blur, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`Labels.ExportCsv` etc., `Labels.ExportHeaders`, `ExportScope`, `ExportFilename`, `OnExport` / `ExportHandler`); dates are real dates in Excel.
- The package now references `LilyDesignSystem.Blazor.DataGrid`.

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
