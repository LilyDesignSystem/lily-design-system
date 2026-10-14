# AGENTS — calendarView (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-calendar/spec/index.md).

A headless calendar: macro `calendarView(opts)` (`calendar-view.njk`) renders the skeleton;
`initCalendarView(root, opts)` / `autoInit(opts)` (`calendar-view.client.js`) builds the days.
Week, four-week or padded month, previous/next/today, a view switcher, APG grid keyboard
navigation (roving tabindex), a picked day, disabled days, events per day. Composes the headless
`calendar-table` macros and `@lilydesignsystem/nunjucks-date-time-picker`'s date arithmetic.
Ships no CSS.

Macro params: `label`, `view`, `anchorDate`, `selectedDate`, `today`, `minDate`, `maxDate`,
`locale`, `labels` (`weekView`, `fourWeekView`, `monthView`, `today`, `previousLabel`,
`nextLabel`), `name`, `id`, `classes`, `attributes`.
Client options: `events`, `isDisabled`, `onNavigate`, `onDayClick`, `onEventClick`, `renderDay`,
`labels` (`previous`, `next`, `periodAnnouncement`, `weekday`, `weekdayAbbr`, `day`).
Keys: arrows, Home/End, PageUp/PageDown, Enter/Space (pick), `t` (today).

Test: `pnpm test`. Build: `pnpm build` (build the sibling date-time-picker first).
