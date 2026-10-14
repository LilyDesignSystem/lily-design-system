# Changelog — `<lily-calendar-view>` (Web Components)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-10-14

Initial release: a port of `@lilydesignsystem/svelte-calendar` 0.2.0 to a
custom element. Week, four-week and padded month views; previous/next/today
navigation; APG grid keyboard model with roving tabindex; picked day
(`selected-date`), disabled days (`min-date`, `max-date`, `isDisabled`), the
`t` shortcut. Callbacks are properties (`onNavigate`, `onDayClick`,
`onEventClick`) paired with events (`calendarnavigate`, `dayclick`,
`eventclick`). Day content is the overridable `renderDay(args)` hook; by
default a day number plus a button per event title.
