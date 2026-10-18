# Changelog — CalendarView (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

- `labels.periodTitle` receives a fourth argument, `anchorDate`, so a month or agenda title can name its month without the consumer tracking the date. Existing three-argument functions keep working. Ported from the Svelte package.

## 0.6.0 — 2026-10-17

- Now composed from the headless layer: the search field is the headless `SearchInput` and a match is the headless `Mark` (the `search-input` / `mark` base classes join the existing `*-search` / `*-match` hooks, so the 57 themes style them too).
- Added `agendaBelow` (agenda on a narrow screen), `agendaDate` (hide the agenda date), right-to-left arrow keys (`isRtl`, `logicalKey`); the themes' today marker is a `currentColor` ring with a bold number, and the table fits a phone.
- Marked `ranges` labels are now real text and the cell's description; weekday headers carry `data-weekend`; the themes shade weekends and ranges.
- Added field `validate` (with `aria-invalid` and `labels.editRefused`) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) through the `fieldEdit` output.
- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `copyHandler`; `toClipboardText`, `copyToClipboard`).
- Added `filter` and `eventCompare`.
- Period changes are announced however they happen (including a consumer setting `anchorDate` or `view`), through one effect; the first render stays silent.
- `minDate` / `maxDate` now bound navigation: Previous / Next go `aria-disabled` at the limit (focus kept), Today is inert when out of range, keyboard moves are clamped, and `labels.rangeLimit(limit, date)` announces the stop.

- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. The Gantt chart and calendar gain search (new).
- Ported from the Svelte 0.6.0; the pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.5.0 — 2026-10-16

- Added typed event fields (`eventFields`, `event.values`) shown after each event's title in the agenda, with a public `fieldText(event, fieldId)` method (Angular has no `day` template); uses the data grid's cell types.
- Added inline field editing in the agenda (`fieldEdit` output, with `[editableFields]="true"`): typed editors, Enter / Escape / Tab, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `exportHandler` / `exportFile`); dates are real dates in Excel.
- Ranges, the selected-date set and event lookups are computed once per change instead of per cell.

## 0.3.0 — 2026-10-16

- Added an agenda (list) view, ported from the Svelte 0.4.0: `view="agenda"` lists the days of the shown month that have events as an ordered list (each day a `<time datetime>` heading, then its events as buttons, or `eventClick`); `agendaEmptyDays` lists every day; `labels.agendaView` gates the switcher button and `labels.agendaEmpty` the empty-month message. `previous` / `next` step by month and `onNavigate` reports the month's range.

## 0.2.0 — 2026-10-14

- Added `showWeekNumbers`, `ranges` (marked ranges) and range selection (`selectedRange`, `onRangeSelect`: Shift+arrows extend, Enter confirms, Shift+click picks, Escape clears), ported from the Svelte 0.3.0.
- Added the one-day `day` view, `maxEvents` (`visibleEvents`, `hiddenCount`), event drag-and-drop and Alt+arrow keys (`onEventMove`, `eventProps`), period title, `hideOutsideDays`, `weekendDays` and multiple selection, ported from the Svelte 0.3.0.

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to
Angular (standalone, signals). Week, four-week and padded month views;
previous/next/today navigation; APG grid keyboard model with roving
tabindex; picked day (`[(selectedDate)]`), disabled days (`minDate`,
`maxDate`, `isDisabled`), the `t` shortcut. `view`, `anchorDate` and
`selectedDate` are `model()`s; `navigate`, `dayClick` and `eventClick` are
outputs. Events render as `.calendar-view-event` buttons showing
`event.title`, in place of the Svelte `day` snippet.
