# `<calendar-view>` (HTML) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `calendar-view.test.ts`.
When the two disagree, the Svelte side wins.

## Differences from Svelte (idiom only)

- `view`, `anchorDate`, `selectedDate` are attributes/properties
  (`view`, `anchor-date`, `selected-date`); the element writes them back as it
  navigates, so they are readable at any time.
- Arrays and functions (`events`, `labels`, `isDisabled`) are properties only.
- Callbacks are properties (`onNavigate`, `onDayClick`, `onEventClick`) and
  bubbling, composed events (`calendarnavigate`, `dayclick`, `eventclick`).
- The `day` snippet is the instance-overridable `renderDay(args)` hook, whose
  `args` carry `selected`, `disabled` and `openEvent`.
- The table markup is built by hand from the `calendar-table*` contract in
  `@lilydesignsystem/html-headless`; civil-date arithmetic comes from
  `@lilydesignsystem/html-date-time-picker`.
- Every state change rebuilds the table; focus is restored to the cursor cell
  after a keyboard-driven change.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.31–§8.50): the one-day view (`day`, `labels.dayView`), `maxEvents` (the day context gets `visibleEvents` and `hiddenCount`), event drag-and-drop with Alt+arrow keys (`onEventMove`, `eventProps`, `labels.eventMoveAnnouncement`), `labels.periodTitle`, `hideOutsideDays`, `weekendDays` (`data-weekend`) and multiple selection (`selectionMode`, `selectedDates`).
