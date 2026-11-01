# @lilydesignsystem/nunjucks-calendar

A headless, accessible calendar for Nunjucks: week, four-week and month views, previous/next/today,
keyboard navigation, a picked day, disabled days and event buttons. A macro renders the skeleton and a
client script builds the days. Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
npm install @lilydesignsystem/nunjucks-calendar @lilydesignsystem/nunjucks-headless @lilydesignsystem/nunjucks-date-time-picker
```

## Quick start

```njk
{% from "@lilydesignsystem/nunjucks-calendar/template" import calendarView %}
{{ calendarView({
  label: "Appointments",
  view: "month",
  anchorDate: "2026-01-15",
  today: "2026-01-08",
  labels: { monthView: "Month", weekView: "Week", today: "Today",
            previousLabel: "Previous", nextLabel: "Next" }
}) }}
```

```js
import { autoInit } from "@lilydesignsystem/nunjucks-calendar";

autoInit({
  events: [{ id: "e1", date: "2026-01-06", title: "Check-up" }],
  labels: {
    previous: (view) => `Previous ${view}`,
    next: (view) => `Next ${view}`,
    weekdayAbbr: (d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d],
  },
  onDayClick: (date) => console.log("picked", date),
  onEventClick: (event) => console.log("open", event.id),
});
```

## Typed event fields, editing and export

- **Typed event fields and editing** (0.5.0): `eventFields` + `event.values` show typed values in the agenda; the client option `onFieldEdit` edits them in place. See [spec](./spec/index.md#typed-event-fields-inline-editing-export-050-2026-10-16).
- **Export** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown period's (or every) event.

## Keyboard

Arrows move the cursor by a day or a week; Home/End go to the row's ends; PageUp/PageDown step by the
view's length; Enter/Space pick the day; `t` goes to today. Disabled days stay focusable but cannot be picked.

## Search, copy, keyboard, validation and undo (0.6.0)

- Added search: `labels.search` renders a field that keeps the events by title and field text; every typed word must appear (any order), ignoring case and diacritics; matches are marked with `<mark class="mark calendar-view-match">`; `labels.searchAnnouncement` announces the count; Escape clears.
- Added right-to-left arrow keys (`isRtl`, `logicalKey`; Alt+Arrow event moves follow the arrow).
- Added copy to the clipboard: `labels.copy` renders a button that puts the export (header row first, tab-separated) on the clipboard; `labels.copyAnnouncement`, `labels.copyFailed`, the client option `onCopy({ text, rowCount })` (return `false` to take over) and the `copy` event.
- Added field `validate` (the editor stays open with `aria-invalid`; `labels.editRefused` announces the reason) and undo / redo of field edits (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl+Y) reported through `onFieldEdit` and the `fieldedit` event; `labels.fieldUndoAnnouncement` / `fieldRedoAnnouncement`.
- Added `eventCompare(a, b)`, which orders a day's events (stable).
- Not yet ported from the Svelte package: the headless `SearchInput` / `Mark` composition (the client builds the same markup by hand), filter, `agendaBelow` / `agendaDate`, range labels as text.

## Known limitations

- **Week numbers are ISO 8601 only.** `showWeekNumbers` numbers weeks the ISO 8601 way: weeks start on Monday and week 1 is the week containing the year's first Thursday. Other systems are not available yet: the US, Canada and Japan number from a Sunday-first week containing 1 January, and some countries use a Saturday-first week. This is a documented gap against the worldwide target, not a decision; it is planned as `weekNumbering: "iso" | "us" | "locale"` (tasks.md P17-T4, worldwide audit (`spec/internationalization/worldwide-audit.md` in the monorepo) finding 4). Until then, leave week numbers off for an audience that does not use ISO weeks, or compute them yourself and show them in your own markup.
- **The column header is yours.** The visible header (`labels.weekNumberHeader`) and any accessible name for a week number are supplied by the app, never English defaults, so you can label the column "Wk", "KW" or "Week (ISO)" and make it clear which system is shown.
