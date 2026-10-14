# AGENTS — CalendarView (Vue helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-calendar/spec/index.md).

A headless Vue 3 calendar: week, four-week or padded month, previous/next/today, a view
switcher, APG grid keyboard navigation (roving tabindex), a picked day, disabled days, and
consumer-rendered events through the `day` scoped slot. It composes
`@lilydesignsystem/vue-headless`'s `CalendarTable` family and
`@lilydesignsystem/vue-date-time-picker`'s civil-date arithmetic. Ships no CSS.

Files: `CalendarView.vue` (implementation), `CalendarView.test.ts` (one test per §8 clause),
`index.ts` (barrel).

Contract: root `<div class="calendar-view {class}">` → optional `.calendar-view-toolbar` (each
control gated on its label) → `CalendarTable` → `.calendar-view-status` (`aria-live="polite"`).
Props: `label`, `today`, `events`, `minDate`, `maxDate`, `isDisabled`, `locale`, `labels`;
models: `view`, `anchorDate`, `selectedDate`; events: `navigate`, `day-click`, `event-click`.
Keys: arrows, Home/End, PageUp/PageDown, Enter/Space (pick), `t` (today).

Test: `pnpm test`. Build: `pnpm build` (build the sibling helper and headless library first).
