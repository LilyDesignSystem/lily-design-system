# Changelog — calendarView (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

- `labels.periodTitle` receives a fourth argument, `anchorDate`, so a month or agenda title can name its month without the consumer tracking the date. Existing three-argument functions keep working. Ported from the Svelte package.
- Works with the label packs: `nunjucksLabelsFor()` (see `shared/label-packs/index.md`) gives the macro `labels` and the client option `labels`.

## 0.6.0 — 2026-10-17

- Added search: `labels.search` renders a field that keeps the events by title and field text; every typed word must appear (any order), ignoring case and diacritics; matches are marked with `<mark class="mark calendar-view-match">`; `labels.searchAnnouncement` announces the count; Escape clears.
- Added right-to-left arrow keys (`isRtl`, `logicalKey`; Alt+Arrow event moves follow the arrow).
- Added copy to the clipboard: `labels.copy` renders a button that puts the export (header row first, tab-separated) on the clipboard; `labels.copyAnnouncement`, `labels.copyFailed`, the client option `onCopy({ text, rowCount })` (return `false` to take over) and the `copy` event.
- Added field `validate` (the editor stays open with `aria-invalid`; `labels.editRefused` announces the reason) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) reported through `onFieldEdit` and the `fieldedit` event; `labels.fieldUndoAnnouncement` / `fieldRedoAnnouncement`.
- Added `eventCompare(a, b)`, which orders a day's events (stable).
- Not yet ported from the Svelte package: the headless `SearchInput` / `Mark` composition (the client builds the same markup by hand), filter, `agendaBelow` / `agendaDate`, range labels as text.
- The pure modules come from `shared/` (`bin/sync-shared-modules`).

## 0.5.0 — 2026-10-16

This release is at the version of the Svelte package it ports (0.5.0).

- Added typed event fields (`eventFields`, `event.values`) shown after each event's title in the agenda, with `fieldText` handed to the `renderDay` option; uses the data grid's cell types.
- Added inline field editing in the agenda (`onFieldEdit`): typed editors, Enter / Escape / Tab, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); dates are real dates in Excel.

## 0.3.0 — 2026-10-16

- Added an agenda (list) view, ported from the Svelte 0.4.0: `view="agenda"` lists the days of the shown month that have events as an ordered list (each day a `<time datetime>` heading, then its events as buttons; client option `renderAgendaDay` for your own); macro `agendaEmptyDays` lists every day; `labels.agendaView` gates the switcher button and client `labels.agendaEmpty` the empty-month message. `previous` / `next` step by month and `onNavigate` reports the month's range.

## 0.2.0 — 2026-10-14

- Added `showWeekNumbers`, `ranges` (marked ranges) and range selection (`selectedRange`, `onRangeSelect`: Shift+arrows extend, Enter confirms, Shift+click picks, Escape clears), ported from the Svelte 0.3.0.
- Added the one-day `day` view, `maxEvents` (`visibleEvents`, `hiddenCount`), event drag-and-drop and Alt+arrow keys (`onEventMove`, `eventProps`), period title, `hideOutsideDays`, `weekendDays` and multiple selection, ported from the Svelte 0.3.0.

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to a
Nunjucks macro plus a client script. The macro renders the toolbar, an
empty `calendar-table` grid and the status region; `calendar-view.client.js`
builds the weekday header and day cells (week, four-week and padded month),
navigation, the APG grid keyboard model, a picked day, disabled days, the
`t` shortcut and events per day. Function-valued props are client init
options (`events`, `isDisabled`, `onNavigate`, `onDayClick`, `onEventClick`,
`renderDay`, and the function-valued labels).
