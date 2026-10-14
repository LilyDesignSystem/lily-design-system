# CalendarView (Angular) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `calendar-view.component.spec.ts`.
When the two disagree, the Svelte side wins.

## Differences from Svelte (idiom and one real deviation)

- `view`, `anchorDate`, `selectedDate` are `model()` signals (`[(view)]`).
- Callbacks are outputs: `navigate` (`{ view, start, end }`), `dayClick`, `eventClick`.
- **No `day` snippet.** Angular has no render prop, so each cell shows its
  day-of-month number followed by one `<button class="calendar-view-event">`
  per event whose `title` is a string; the button emits `eventClick` and does
  not pick the day (§8.21 is tested that way). Consumers needing other markup
  style `.calendar-view-event` or wrap the component.
- Angular's headless `CalendarTable` sets no `role="grid"`, and
  `CalendarTableTD` has no `selected`/`today` inputs, so the role is applied
  once after render and the cell's `role`, `tabindex`, `aria-selected` and
  `aria-current` are set in this component's template.

## Composition

`@lilydesignsystem/angular-headless`'s `CalendarTable` family, unmodified, and
`@lilydesignsystem/angular-date-time-picker`'s exported civil-date arithmetic.

## Svelte 0.3.0 parity (2026-10-14)

Ported from the Svelte canonical spec (§13 there; clauses §8.22–§8.30): week numbers (`showWeekNumbers`), marked ranges (`ranges`, `data-range`) and range selection (`selectedRange`, `onRangeSelect`, `data-in-range`, `data-range-start`, `data-range-end`).
