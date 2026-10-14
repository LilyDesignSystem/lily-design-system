# AGENTS — CalendarView (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-calendar/spec/index.md).

A headless Angular calendar (`<lily-calendar-view>`): week, four-week or padded month,
previous/next/today, a view switcher, APG grid keyboard navigation (roving tabindex), a picked
day, disabled days, and event buttons per day. Composes `@lilydesignsystem/angular-headless`'s
`CalendarTable` family and `@lilydesignsystem/angular-date-time-picker`'s civil-date arithmetic.
Ships no CSS.

Files: `calendar-view.component.ts`, `calendar-view.component.spec.ts` (one test per §8 clause),
`index.ts`.

Inputs: `label`, `events`, `today`, `minDate`, `maxDate`, `isDisabled`, `locale`, `labels`,
`className`; models: `view`, `anchorDate`, `selectedDate`; outputs: `navigate`, `dayClick`,
`eventClick`. Keys: arrows, Home/End, PageUp/PageDown, Enter/Space (pick), `t` (today).

Test: `pnpm test`. Build: `pnpm build` (build the sibling helper and headless library first).
