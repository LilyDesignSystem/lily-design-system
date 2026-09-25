# AGENTS — CalendarView (Svelte helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Svelte 5 headless calendar *viewing* surface — week,
rolling four-week, or padded-month browse, never a date-selection
input (`date-time-picker` already owns that) or a date-range picker
(`CalendarRangePicker` already owns that). It composes
`@lilydesignsystem/svelte-headless`'s `CalendarTable` family (a real
npm dependency, unmodified) and, for its civil-date arithmetic and its
WAI-ARIA APG calendar keyboard model, the sibling helper
`@lilydesignsystem/svelte-date-time-picker`. Ships no CSS.

Proposed and documented first in
[spec/helpers/index.md § calendar-view contract](../../spec/helpers/index.md)
(2026-09-22), implemented here the same day. No other framework
catalog ports it yet.

## Files

| File                  | Purpose                                                |
| ---------------------- | ------------------------------------------------------- |
| `spec/index.md`        | Specification-driven contract (canonical).             |
| `CalendarView.svelte`  | Implementation. TypeScript + Svelte 5 runes.            |
| `CalendarView.test.ts` | Vitest spec, one or more assertions per §8 acceptance. |
| `CalendarViewEventsTestHost.svelte` | Test-only host exercising the `day` snippet prop with real Svelte template syntax. |
| `index.ts`             | Barrel re-export.                                       |
| `index.md`             | User guide.                                             |

## Public surface

- Default export: `CalendarView` component.
- Named export: `CalendarView`.
- Type exports: `Props`, `CalendarViewMode` (the `"week" | "four-week"
  | "month"` union — renamed on export from the component's own
  `CalendarView` type to avoid colliding with the component's own
  name), `CalendarEvent`, `CalendarViewLabels`, `DayArgs`.
- Utility exports: `weekStart`, `periodDays`, `periodRange`,
  `isOutsidePeriod`, `eventsByDay` — pure period-computation and
  event-placement helpers, exported because they are independently
  useful and independently testable.

Required props: `label`, `view`, `anchorDate`.

## Behaviour contract (one paragraph)

`view` (`"week" | "four-week" | "month"`) and `anchorDate` (both
bindable) compute the visible days: week is exactly 7 days from the
locale-aware week start; four-week is a rolling 28-day window from the
same week start; month is the fixed 6-row, 42-day `monthMatrix` shape
`date-time-picker`'s own calendar dialog already generates, with
leading/trailing adjacent-month days marked `data-outside-period`. A
toolbar (rendered only when at least one view-switcher label is
supplied) offers a week/four-week/month switch (`aria-pressed`) and
previous/next/today navigation, each stepping by the current view's
own length and firing `onNavigate(view, start, end)`. `events` are
matched to the day(s) they cover (`date`, or every day in an inclusive
`[start, end]`) and handed to the consumer's own `day` snippet per
cell — this package owns placement only, never event-card visual
design. Keyboard follows the exact model already implemented in
`date-time-picker`'s own calendar-dialog grid (`ArrowLeft/Right/Up/
Down`, `Home/End`, `PageUp/PageDown`), including its re-paging
behaviour when the moved-to cursor date falls outside the currently
visible days. Every navigation announces the new period through one
`.calendar-view-status aria-live="polite"` region built from
`labels.periodAnnouncement`.

## HTML

See [spec/index.md §4](./spec/index.md#4-html) for the full markup
shape. Root: `<div class="calendar-view {class}">` wrapping an
optional `.calendar-view-toolbar`, the unmodified `CalendarTable`
family, and a status region.

## Accessibility

- WAI-ARIA APG Grid pattern (`role="grid"`, inherited from
  `CalendarTable`).
- Roving tabindex via `CalendarTableTD`'s own `selected` prop — one
  cell `tabindex="0"` at a time. `selected` already means "the
  roving-tabindex cursor" in that component's own doc comment, so this
  is on-label usage, not an overload requiring a workaround (unlike
  `GanttTableTD`'s `active` prop, which `gantt-chart` found genuinely
  overloaded).
- Every day cell's accessible name comes from `labels.day` — a full
  name per cell (e.g. "11, Tuesday, 6 January 2026"), never a bare day
  number, per the accessibility research cited in
  spec/helpers/index.md § calendar-view contract.
- One `aria-live="polite"` region for all period-change announcements.

## Conventions this package follows

- Svelte 5 runes (`$props`, `$bindable`, `$derived`, `$derived.by`,
  `$effect`).
- Strict TypeScript on the public surface.
- Depends on `@lilydesignsystem/svelte-headless` and
  `@lilydesignsystem/svelte-date-time-picker` as real dependencies —
  never vendors `CalendarTable`'s or its date-arithmetic's own
  implementation.
- Civil-date arithmetic throughout, entirely via `date-time-picker`'s
  own exports — never local-midnight `Date` construction (DST-bug-
  prone, an established Lily convention).
- No bundled CSS, fonts, or images.
- Every user-facing string is a `labels.*` prop; a label's presence
  gates the control it names — the toolbar itself renders only when at
  least one view-switcher label is supplied. No baked-in English
  fallback.
- Non-goals (event creation/editing UI, drag-to-reschedule, day view,
  agenda/list view, recurring-event expansion, timezone conversion,
  virtualization, multi-calendar/resource views, print/export) are
  documented, not silently missing — see spec/index.md §9.
