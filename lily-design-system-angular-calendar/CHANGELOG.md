# Changelog — CalendarView (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to
Angular (standalone, signals). Week, four-week and padded month views;
previous/next/today navigation; APG grid keyboard model with roving
tabindex; picked day (`[(selectedDate)]`), disabled days (`minDate`,
`maxDate`, `isDisabled`), the `t` shortcut. `view`, `anchorDate` and
`selectedDate` are `model()`s; `navigate`, `dayClick` and `eventClick` are
outputs. Events render as `.calendar-view-event` buttons showing
`event.title`, in place of the Svelte `day` snippet.
