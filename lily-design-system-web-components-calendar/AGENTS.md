# AGENTS — `<lily-calendar-view>` (Web Components helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-calendar/spec/index.md).

A headless custom element: week, four-week or padded month, previous/next/today, a view
switcher, APG grid keyboard navigation (roving tabindex), a picked day, disabled days, and
overridable per-day rendering. Builds the `calendar-table*` markup contract by hand; reuses
`@lilydesignsystem/web-components-date-time-picker`'s civil-date arithmetic. Ships no CSS.

Files: `calendar-view.ts` (element), `calendar-view.test.ts` (one test per §8 clause), `index.ts`
(barrel; registers `calendar-view`).

Attributes: `label`, `view`, `anchor-date`, `selected-date`, `today`, `min-date`, `max-date`,
`locale`, `class`. Properties: `events`, `labels`, `isDisabled`, `onNavigate`, `onDayClick`,
`onEventClick`, `renderDay`. Events: `calendarnavigate`, `dayclick`, `eventclick`.
Keys: arrows, Home/End, PageUp/PageDown, Enter/Space (pick), `t` (today).

Test: `pnpm test`. Build: `pnpm build` (build the sibling helper first).
