# Changelog — CalendarView (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

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
