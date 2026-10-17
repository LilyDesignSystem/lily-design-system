# Changelog — CalendarView (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.5.0 — 2026-10-16

- Added typed event fields (`eventFields`, `event.values`) shown after each event's title in the agenda, with `fieldText` handed to the `day` slot; uses the data grid's cell types.
- Added inline field editing in the agenda (`field-edit`): typed editors, Enter / Escape / Tab, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `exportHandler` / `export-file`); dates are real dates in Excel.
- Ranges, the selected-date set and event lookups are computed once per change instead of per cell.

## 0.3.0 — 2026-10-16

- Added an agenda (list) view, ported from the Svelte 0.4.0: `view="agenda"` lists the days of the shown month that have events as an ordered list (each day a `<time datetime>` heading, then its events as buttons, or your `day` slot); `agendaEmptyDays` lists every day; `labels.agendaView` gates the switcher button and `labels.agendaEmpty` the empty-month message. `previous` / `next` step by month and `onNavigate` reports the month's range.

## 0.2.0 — 2026-10-14

- Added `showWeekNumbers`, `ranges` (marked ranges) and range selection (`selectedRange`, `onRangeSelect`: Shift+arrows extend, Enter confirms, Shift+click picks, Escape clears), ported from the Svelte 0.3.0.
- Added the one-day `day` view, `maxEvents` (`visibleEvents`, `hiddenCount`), event drag-and-drop and Alt+arrow keys (`onEventMove`, `eventProps`), period title, `hideOutsideDays`, `weekendDays` and multiple selection, ported from the Svelte 0.3.0.

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to
Vue 3. Week, four-week and padded month views; previous/next/today
navigation; APG grid keyboard model with roving tabindex; events placed
through a `day` scoped slot; picked day (`v-model:selectedDate`), disabled
days (`minDate`, `maxDate`, `isDisabled`), the `t` shortcut, and
`event-click` through the slot's `openEvent`. `view`, `anchorDate` and
`selectedDate` are `v-model`s; `navigate`, `day-click` and `event-click`
are emitted events.
