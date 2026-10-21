# CalendarView (Alpine.js helper)

A headless **calendar** for [Alpine.js](https://alpinejs.dev/): a plugin (`Alpine.data("lilyCalendarView", …)`) plus
`snippet.html`, the `role="grid"` month / week markup that uses it. Previous / next / today, a picked day, disabled days
(focusable but not pickable), `minDate` / `maxDate` bounds, events as buttons inside their day, and the WAI-ARIA APG date-grid
keys. Dates are ISO `YYYY-MM-DD` strings handled in UTC, so no time zone shifts a day. Ships no CSS and no text: every string,
including weekday names, is a `labels.*` value.

It is a subset of the canonical [`@lilydesignsystem/svelte-calendar`](../lily-design-system-svelte-calendar/), whose
[spec](../lily-design-system-svelte-calendar/spec/index.md) is the contract. The subset and the gaps are in
[spec/index.md](spec/index.md).

## Usage

```html
<script type="module">
  import Alpine from "alpinejs";
  import lilyCalendarView from "@lilydesignsystem/alpine-calendar";
  Alpine.plugin(lilyCalendarView);
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  window.calendarOptions = {
    today: "2026-10-21",
    events: [{ id: "e1", date: "2026-10-06", title: "Check-up" }],
    labels: {
      grid: "Appointments",
      today: "Today",
      previous: (view) => `Previous ${view}`,
      next: (view) => `Next ${view}`,
      weekdayAbbr: (d) => weekdays[d].slice(0, 3),
      periodAnnouncement: (start, end, view) => `${view} ${start} to ${end}`,
    },
  };
  Alpine.start();
</script>
<!-- then paste snippet.html (importable as @lilydesignsystem/alpine-calendar/snippet.html) -->
```

Options: `view` (`month` | `week`), `anchor`, `today`, `picked`, `weekStart` (0 Sunday … 6), `events`, `minDate`, `maxDate`,
`isDisabled(date)`, `labels`. The component picks no locale and reads the system date only if `today` is left out.
`createCalendarView(options)` returns the same state without Alpine; `addDays`, `addMonths`, `startOfWeek`, `dayOfWeek` and
`daysInMonth` are exported.

## Events

`lily:pick` (`{ date }`) and `lily:event` (`{ id }`), bubbling from the calendar.

## Keyboard

Only one day is in the tab order. Arrows move a day or a week (right-to-left swaps the horizontal pair); Home / End go to the
row's ends; PageUp / PageDown step a month (the day clamped: 31 Jan → 28 Feb) or, in the week view, a week; Enter or Space pick;
`t` goes to today. Moving past the shown grid changes the period and keeps focus on the right day. The cursor stays inside
`minDate` / `maxDate`.

## Install

```sh
npm install @lilydesignsystem/alpine-calendar alpinejs
```

Lily™ and Lily Design System™ are trademarks.
