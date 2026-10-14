# AGENTS — CalendarView (React helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-calendar/spec/index.md). Read both first.

## What this package is

A headless React 19 calendar: a week, a rolling four weeks, or a padded month, with
previous/next/today navigation, a view switcher, APG grid keyboard navigation (roving
tabindex), a picked day, disabled days, and consumer-rendered events per day. It composes
`@lilydesignsystem/react-headless`'s `CalendarTable` family (unmodified) and
`@lilydesignsystem/react-date-time-picker`'s civil-date arithmetic. Ships no CSS.

## Files

| File                  | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `spec/index.md`       | Port notes; the canonical contract is Svelte's. |
| `CalendarView.tsx`    | Implementation.                                 |
| `CalendarView.test.tsx` | Vitest spec, one test per §8 clause.          |
| `index.ts`            | Barrel re-export.                               |

## Contract in one screen

Root `<div class="calendar-view {className}">` → optional `.calendar-view-toolbar`
(view switcher + nav, each gated on its label) → `CalendarTable` → `.calendar-view-status`
(`aria-live="polite"`). Props: `label`, `view`/`defaultView`, `anchorDate`/`defaultAnchorDate`,
`selectedDate`/`defaultSelectedDate`, `events`, `today`, `minDate`, `maxDate`, `isDisabled`,
`locale`, `labels`, `onNavigate`, `onDayClick`, `onEventClick`, `day` (render prop).
Keys: arrows, Home/End, PageUp/PageDown, Enter/Space (pick), `t` (today).

## Test

`pnpm test` (vitest + jsdom). Build with `pnpm build`; build the sibling helper and headless
library first (`bin/list-helper-packages react`).
