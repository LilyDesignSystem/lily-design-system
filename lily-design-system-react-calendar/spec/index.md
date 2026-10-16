# CalendarView (React) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `CalendarView.test.tsx`.
When the two disagree, the Svelte side wins.

## Differences from Svelte (idiom only)

- `view`, `anchorDate` and `selectedDate` are not `$bindable`: each is
  controlled when passed, or seeded by `defaultView`, `defaultAnchorDate`
  and `defaultSelectedDate`, and reports changes through `onViewChange`,
  `onAnchorDateChange` and `onSelectedDateChange`. `anchorDate` defaults to
  `today`, then `1970-01-01`, when neither is given.
- The `day` snippet is a `day(args)` render prop; `className` replaces
  `class`.
- Focus after a re-page moves in an effect, not a microtask.

## Composition

`@lilydesignsystem/react-headless`'s `CalendarTable` family, unmodified, and
`@lilydesignsystem/react-date-time-picker`'s exported civil-date arithmetic.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.31–§8.50): the one-day view (`day`, `labels.dayView`), `maxEvents` (the day context gets `visibleEvents` and `hiddenCount`), event drag-and-drop with Alt+arrow keys (`onEventMove`, `eventProps`, `labels.eventMoveAnnouncement`), `labels.periodTitle`, `hideOutsideDays`, `weekendDays` (`data-weekend`) and multiple selection (`selectionMode`, `selectedDates`).

## Agenda view (2026-10-16)

Ported from the Svelte canonical (its spec "Agenda view", tests §8.64–§8.68): `view="agenda"` is the list counterpart of the month grid over the same period (`periodRange` treats it as the month; `periodDays` is empty). A plain `<ol class="calendar-view-agenda" aria-label>` with ordinary tab stops, no roving cursor, no selection keys. Each `<li class="calendar-view-agenda-day" data-date>` carries `data-today` / `aria-current="date"`, `data-weekend`, `data-range`, a `<time class="calendar-view-agenda-date" datetime>` heading (`labels.day(date, weekday, false)`, else the ISO date) and the day's events — the `day` hook when given, otherwise a `.calendar-view-event` button per event (its `title` when a string, else its id) that fires `onEventClick`. Only days with events unless `agendaEmptyDays`; `labels.agendaEmpty` shows when there are none.
