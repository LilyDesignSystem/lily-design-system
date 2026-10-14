# Changelog — CalendarView (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-14

- Added `showWeekNumbers`, `ranges` (marked ranges) and range selection (`selectedRange`, `onRangeSelect`: Shift+arrows extend, Enter confirms, Shift+click picks, Escape clears), ported from the Svelte 0.3.0.

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to
React 19. Week, four-week and padded month views; previous/next/today
navigation; APG grid keyboard model with roving tabindex; events placed
through a `day` render prop; picked day (`selectedDate`), disabled days
(`minDate`, `maxDate`, `isDisabled`), the `t` shortcut, and `onEventClick`
through the render prop's `openEvent`. `view`, `anchorDate` and
`selectedDate` are each controlled when passed, or seeded by a `default…`
prop, with `on…Change` callbacks.
