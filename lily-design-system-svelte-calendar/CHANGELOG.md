# Changelog — CalendarView (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.6.0 — 2026-10-17

- Added copy to the clipboard (`labels.copy`, `copyAnnouncement`, `copyFailed`, `onCopy`; `toClipboardText`, `copyToClipboard`).
- Added `filter` and `eventCompare`.
- Period changes are announced however they happen (including a consumer setting `anchorDate` or `view`), through one effect; the first render stays silent.
- `minDate` / `maxDate` now bound navigation: Previous / Next go `aria-disabled` at the limit (focus kept), Today is inert when out of range, keyboard moves are clamped, and `labels.rangeLimit(limit, date)` announces the stop.

- Search: every word must appear (any order), ignoring case and diacritics; typed field text is searched; matches are highlighted with `<mark>` (not in the data grid's cells); `labels.searchAnnouncement(matches, total)`; Escape clears. The Gantt chart and calendar gain search (new).

## 0.5.0 — 2026-10-16

- Added typed event fields (`eventFields`, `event.values`) shown after each event's title in the agenda, with `fieldText` handed to the `day` snippet; uses the data grid's cell types.
- Added inline field editing in the agenda (`onFieldEdit`): typed editors, Enter / Escape / Tab, IME-safe, refused when invalid for the type, announced.
- Added export to CSV, TSV and Excel (`labels.exportCsv` etc., `labels.exportHeaders`, `exportScope`, `exportFilename`, `onExport`); dates are real dates in Excel.
- Ranges, the selected-date set and event lookups are computed once per change instead of per cell.

## 0.4.0 — 2026-10-16

- Added an agenda (list) view: `view="agenda"` lists the days of the shown month that have events as an ordered list (each day a `<time datetime>` heading, then its events as buttons, or your `day` snippet); `agendaEmptyDays` lists every day; `labels.agendaView` gates the switcher button and `labels.agendaEmpty` the empty-month message. `previous` / `next` step by month and `onNavigate` reports the month's range.

## 0.3.0 — 2026-10-14

- Added `showWeekNumbers` (a row header per week with the ISO week number; `labels.weekNumberHeader`, `labels.weekNumber`),
  `ranges` (marked ranges, `data-range="{kind}"`, also passed to the `day` snippet) and range selection: Shift+arrows extend
  a bindable `selectedRange` from the cursor, Enter confirms it through `onRangeSelect`, Shift+click picks one, Escape clears it
  (`data-in-range`, `data-range-start`, `data-range-end`; `labels.rangeAnnouncement`).
- Added a one-day `"day"` view (`labels.dayView`); `maxEvents` (the `day` snippet gets `visibleEvents` and `hiddenCount`);
  `onEventMove` with drag-and-drop of events between days (`eventProps(ev)` on the `day` snippet) and Alt+arrow keys on a focused
  event (`labels.eventMoveAnnouncement`); `labels.periodTitle`; `hideOutsideDays`; `weekendDays` (`data-weekend`);
  `selectionMode="multiple"` with a bindable `selectedDates`.

## 0.2.0 — 2026-10-14

- Renamed from `svelte-calendar-view` to `svelte-calendar`: the package is
  now `@lilydesignsystem/svelte-calendar`. The component (`CalendarView`)
  and its `.calendar-view*` class hooks are unchanged. The old name's
  0.1.0 stays on npm.
- Added `selectedDate` (bindable, shown as `data-selected`), `minDate`,
  `maxDate` and `isDisabled` (`aria-disabled`, focusable but not pickable),
  the `t` shortcut for today, and a working `onEventClick` through the
  `day` snippet's new `openEvent`, `selected` and `disabled` arguments.
- Research and ranked next ideas: spec §11.

## 0.1.0 — 2026-09-22

Initial release. Proposed and specced in
[spec/helpers/index.md § calendar contract](../spec/helpers/index.md),
then implemented here as the canonical (and, for now, only) catalog.
Composes `@lilydesignsystem/svelte-headless`'s `CalendarTable` family
(unmodified) and `@lilydesignsystem/svelte-date-time-picker`'s
exported civil-date arithmetic (`monthMatrix`, `weekdayOf`,
`firstDayOfWeekFor`, `addDays`, `addMonths`) and its calendar dialog's
own WAI-ARIA APG keyboard model, reused directly rather than
re-derived — the third helper (after `picker-bar` and `gantt-chart`)
to depend on a sibling helper.

Three view periods: a 7-day week, a rolling 28-day four-week window,
and a padded 42-day calendar month (leading/trailing adjacent-month
days carry `data-outside-period`), switched via a toolbar whose
buttons only render when their own label is supplied. Previous/next/
today navigation steps by the current view's own length. Keyboard
navigation mirrors `date-time-picker`'s own calendar-dialog grid
exactly, including its re-paging behaviour when the moved-to cursor
date falls outside the currently visible days. `events` (single-day
`date`, or multi-day `[start, end]`) are placed into day cells via a
consumer-supplied `day` snippet — this package owns placement only,
never event-card visual design. Every navigation announces the new
period through one `aria-live="polite"` status region. Event creation/
editing UI, drag-to-reschedule, day view, agenda/list view, recurring-
event expansion, timezone conversion, virtualization, multi-calendar/
resource views, and print/export are documented v1 non-goals, not
gaps — see spec/index.md §9.

`CalendarTableTD`'s own `selected` prop already means "the
roving-tabindex cursor" in that component's own doc comment (not a
separate date-picker-style persisted selection), so this package uses
it exactly on-label for its own keyboard cursor — unlike
`GanttTableTD`'s `active` prop, which `gantt-chart` found genuinely
overloaded, there was no workaround to design here. See spec/index.md
§3.

---

Lily™ and Lily Design System™ are trademarks.
