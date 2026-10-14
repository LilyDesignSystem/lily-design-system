# CalendarView (Vue) — Specification

A port of the canonical Svelte spec,
[lily-design-system-svelte-calendar/spec/index.md](../../lily-design-system-svelte-calendar/spec/index.md),
whose clauses §8.1–§8.21 each have a test in `CalendarView.test.ts`.
When the two disagree, the Svelte side wins.

## Differences from Svelte (idiom only)

- `view`, `anchorDate` and `selectedDate` are `defineModel`s
  (`v-model:view` and so on), the Vue form of `$bindable`.
- Callbacks are emitted events: `navigate`, `day-click`, `event-click`.
- The `day` snippet is a `day` scoped slot; slot props are `date`, `events`,
  `isToday`, `outsidePeriod`, `selected`, `disabled`, `openEvent`.

## Composition

`@lilydesignsystem/vue-headless`'s `CalendarTable` family, unmodified, and
`@lilydesignsystem/vue-date-time-picker`'s exported civil-date arithmetic.
