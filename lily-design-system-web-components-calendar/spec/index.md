# `<lily-calendar-view>` (Web Components) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `calendar-view.test.ts`.
When the two disagree, the Svelte side wins.

## Relationship to the HTML helper

This is a maintainer-directed **independent copy** of
`@lilydesignsystem/html-calendar` (see `AGENTS/helpers.md`): the same code
with the `lily-` tag prefix and the Web Components date-time-picker. Nothing
ports between them automatically; keep them in step deliberately. The table is
built by hand, as in the HTML helper, rather than by nesting
`<lily-calendar-table>`, whose consumer-supplied rows would add a wrapper
element with no benefit here.

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
  `@lilydesignsystem/web-components-headless`; civil-date arithmetic comes from
  `@lilydesignsystem/web-components-date-time-picker`.
- Every state change rebuilds the table; focus is restored to the cursor cell
  after a keyboard-driven change.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).

## Svelte 0.3.0 parity, round 3 (2026-10-14)

Ported from the Svelte canonical spec (§14 there; clauses §8.31–§8.50): the one-day view (`day`, `labels.dayView`), `maxEvents` (the day context gets `visibleEvents` and `hiddenCount`), event drag-and-drop with Alt+arrow keys (`onEventMove`, `eventProps`, `labels.eventMoveAnnouncement`), `labels.periodTitle`, `hideOutsideDays`, `weekendDays` (`data-weekend`) and multiple selection (`selectionMode`, `selectedDates`).

## Agenda view (2026-10-16)

Ported from the Svelte canonical (its spec "Agenda view", tests §8.64–§8.68): `view="agenda"` is the list counterpart of the month grid over the same period (`periodRange` treats it as the month; `periodDays` is empty). A plain `<ol class="calendar-view-agenda" aria-label>` with ordinary tab stops, no roving cursor, no selection keys. Each `<li class="calendar-view-agenda-day" data-date>` carries `data-today` / `aria-current="date"`, `data-weekend`, `data-range`, a `<time class="calendar-view-agenda-date" datetime>` heading (`labels.day(date, weekday, false)`, else the ISO date) and the day's events — `renderAgendaDay` (overridable), by default a `.calendar-view-event` button per event (its `title` when a string, else its id) that fires `eventclick`. Only days with events unless `agenda-empty-days`; `labels.agendaEmpty` shows when there are none.
