# Changelog — calendarView (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-14

- Added `showWeekNumbers`, `ranges` (marked ranges) and range selection (`selectedRange`, `onRangeSelect`: Shift+arrows extend, Enter confirms, Shift+click picks, Escape clears), ported from the Svelte 0.3.0.

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to a
Nunjucks macro plus a client script. The macro renders the toolbar, an
empty `calendar-table` grid and the status region; `calendar-view.client.js`
builds the weekday header and day cells (week, four-week and padded month),
navigation, the APG grid keyboard model, a picked day, disabled days, the
`t` shortcut and events per day. Function-valued props are client init
options (`events`, `isDisabled`, `onNavigate`, `onDayClick`, `onEventClick`,
`renderDay`, and the function-valued labels).
