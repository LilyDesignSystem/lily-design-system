# calendarView (Nunjucks) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `calendar-view.test.ts`.
When the two disagree, the Svelte side wins.

## Differences from Svelte

- **Two parts.** `calendar-view.njk` renders the skeleton (toolbar, empty
  grid, status); `calendar-view.client.js` builds the weekday header and day
  cells, because which days appear needs civil-date arithmetic a template
  cannot do. This is the same split `gantt-chart` uses.
- **Callbacks are client init options**, as in every Nunjucks helper: `events`,
  `isDisabled`, `onNavigate`, `onDayClick`, `onEventClick`, `renderDay` (the
  `day` snippet), and the function-valued labels (`previous`, `next`,
  `periodAnnouncement`, `weekday`, `weekdayAbbr`, `day`).
- **String labels are macro params** (`weekView`, `fourWeekView`, `monthView`,
  `today`, and the fixed `previousLabel`/`nextLabel` that name the arrows until
  hydration).
- **State is data attributes** on the root (`view`, `anchor-date`,
  `selected-date`, `today`, `min-date`, `max-date`, `locale`), so the SSR
  markup and the hydrated element agree and a consumer can read or set them.
- `setEvents(events)` on the init result replaces the events and re-renders.

## Composition

`@lilydesignsystem/nunjucks-headless`'s `calendar-table` macros for the grid
skeleton, and `@lilydesignsystem/nunjucks-date-time-picker`'s exported
civil-date arithmetic in the client.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.31–§8.50): the one-day view (`day`, `labels.dayView`), `maxEvents` (the day context gets `visibleEvents` and `hiddenCount`), event drag-and-drop with Alt+arrow keys (`onEventMove`, `eventProps`, `labels.eventMoveAnnouncement`), `labels.periodTitle`, `hideOutsideDays`, `weekendDays` (`data-weekend`) and multiple selection (`selectionMode`, `selectedDates`).
