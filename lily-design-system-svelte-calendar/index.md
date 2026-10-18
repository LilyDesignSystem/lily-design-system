# CalendarView (Svelte helper)

A reusable Svelte 5 headless **calendar viewing surface** — week,
rolling four-week, or calendar-month browse. It composes
`@lilydesignsystem/svelte-headless`'s `CalendarTable` family
(unmodified) and `@lilydesignsystem/svelte-date-time-picker`'s civil-date
arithmetic and calendar-dialog keyboard model. Ships no CSS: every
visual detail is the consumer's, via kebab-case class hooks and
`data-*` attributes.

This is a *viewing* helper, not a date-selection input
(`date-time-picker` already owns that) and not a date-range picker
(`CalendarRangePicker` already owns that) — see
[spec/index.md](./spec/index.md) for the full contract and the
research behind the three view periods and the keyboard model.

## Usage

```svelte
<script lang="ts">
  import CalendarView from "@lilydesignsystem/svelte-calendar";
  import type { CalendarEvent, CalendarView as CalendarViewMode } from "@lilydesignsystem/svelte-calendar";

  let view = $state<CalendarViewMode>("month");
  let anchorDate = $state("2026-01-15");

  const events: CalendarEvent[] = [
    { id: "e1", date: "2026-01-06", title: "Flu clinic" },
    { id: "e2", start: "2026-01-19", end: "2026-01-23", title: "On call" },
  ];
</script>

<CalendarView
  label="Appointments"
  bind:view
  bind:anchorDate
  {events}
  today="2026-01-08"
  labels={{
    weekView: "Week",
    fourWeekView: "4 weeks",
    monthView: "Month",
    previous: (v) => `Previous ${v}`,
    next: (v) => `Next ${v}`,
    today: "Today",
    periodAnnouncement: (v, start, end) => `Showing ${v} from ${start} to ${end}`,
    weekday: (wd) => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][wd],
    weekdayAbbr: (wd) => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][wd],
    day: (isoDate, wd, outside) => `${Number(isoDate.slice(8))}${outside ? " (outside month)" : ""}`,
  }}
  onDayClick={(isoDate) => console.log("clicked", isoDate)}
>
  {#snippet day({ date, events, isToday })}
    {#each events as event (event.id)}
      <span class="calendar-view-event">{event.title}</span>
    {/each}
  {/snippet}
</CalendarView>
```

## Props

**Rescheduling needs a focusable event element.** `eventProps(event)` makes an event draggable and carries `data-event-id`, but adds no `tabindex`: Alt+arrow only fires when focus is on (or inside) an element with `data-event-id`, so give that element `tabindex="0"` (or render a `<button>`) in your `day` snippet.

See [spec/index.md §5](./spec/index.md#5-props) for the full table.
Required: `label`, `view`, `anchorDate`. Every optional `labels.*`
field gates the control it names — the toolbar itself renders only
when at least one view-switcher label is supplied.

## Behaviour

- **Three view periods**: week (7 days), a rolling four-week window
  (28 days), and a padded calendar month (42 days; leading/trailing
  adjacent-month days carry `data-outside-period`).
- **Navigation**: previous/next step by the current view's own
  length; today (when the `today` prop is supplied) jumps to it
  without changing view.
- **Events**: `date` for a single day, or `start`/`end` for a
  multi-day range; placed into each covered day's `day` snippet.
  This package owns placement only, never event-card visual design.
- **Keyboard**: the same WAI-ARIA APG calendar grid model
  `date-time-picker`'s own dialog already implements — arrow keys,
  `Home`/`End`, `PageUp`/`PageDown` — including re-paging when the
  cursor moves outside the visible days.
- **Announcements**: every navigation announces the new period via one
  `aria-live="polite"` region.
- **Typed event fields and editing** (0.5.0): `eventFields` + `event.values` show typed values in the agenda; `onFieldEdit` edits them in place. See [spec §16](./spec/index.md#16-typed-event-fields-inline-editing-export-hot-path-caching-050-2026-10-16).
- **Export** (0.5.0): `labels.exportCsv` / `exportTsv` / `exportExcel` plus `labels.exportHeaders` add CSV, TSV and Excel buttons for the shown period's (or every) event.

## Period announcements and limits (0.6.0)

The shown period is announced (`labels.periodAnnouncement`) whenever it changes, however it changed. `minDate` / `maxDate` bound navigation as well as picking: Previous / Next go `aria-disabled` at the limit, Today is inert out of range, keyboard moves are clamped, and `labels.rangeLimit(limit, date)` announces the stop. See spec §18.

## Filtering and sorting (0.6.0)

- **`filter(event)`** hides events it rejects in every view, combining with `search` (both must pass).
- **`eventCompare(a, b)`** orders the events within a day, and so in the agenda; stable.

## Export: copy to clipboard (0.6.0)

- **Copy to clipboard**: `labels.copy` names a button (`data-…-export-format="copy"`; for the kanban board, Gantt chart and calendar it also needs `labels.exportHeaders`, like the downloads) that puts exactly what a download would hold — the same events, scope and order, header row first — on the clipboard as tab-separated text (`toClipboardText`: no byte-order mark, formula text defused), ready to paste into a spreadsheet. `copyToClipboard` uses the async Clipboard API and falls back to a hidden, selected `<textarea>` with `execCommand("copy")`; it never throws. `labels.copyAnnouncement(rowCount)` is announced, `labels.copyFailed` when neither path worked, and `onCopy({ text, rowCount })` may return `false` to take over (nothing is copied).

## In-place edit: validation, undo and redo (0.6.0)

- **Field `validate(value, values)`** refuses a value of the right type that is not acceptable: return the reason. The editor stays open with `aria-invalid="true"` (cleared as soon as the user types again) and `labels.editRefused(event, header, reason)` is announced, falling back to `labels.editInvalid`. Undo and redo work from anywhere in the calendar.
- **Undo and redo**: every accepted edit is remembered (the latest 100). Ctrl/Cmd+Z puts the earlier value back and Ctrl/Cmd+Shift+Z (or Ctrl+Y) re-applies one, both **through `onFieldEdit`** with the restored value and the one it replaced — the consumer owns the data, so an undo is reported like an edit, and an undo is not itself recorded. A new edit ends the redo chain. Inside a field editor the browser's own undo is left alone; nothing happens in a `readonly` component or without `onFieldEdit`. `labels.undoAnnouncement(event, header, text)` / `labels.redoAnnouncement(event, header, text)` are announced. The stacks are the pure `edit-history.ts` (`recordEdit`, `undoEdit`, `redoEdit`, `historyKey`).

## Weekend, holiday and time-off indicators (0.6.0)

- **Marked ranges** (`ranges`: `{ start, end, kind?, label? }`, already there for holidays, closures and terms) now carry their `label` as real text: shown beside the day number (and the agenda date) when there is no `day` snippet, and read as the cell's description (`aria-describedby` a hidden span, several labels joined with ", "), so a screen reader hears why a day is marked and the day is never colour-only. A range without a label marks the day and adds no text. A `day` snippet still receives `ranges` and renders its own.
- **Weekends**: the weekday header cells now carry `data-weekend` like the day cells (`weekendDays`, never defaulted).
- **Shading** is CSS and ships in the 57 reference themes: weekend cells are tinted; a day inside a range is tinted and striped.

## Narrow screens, agenda dates, today and direction (0.6.0)

- **Agenda on a narrow screen.** `agendaBelow` (pixels, for example `640`) makes a viewport narrower than that read as the agenda view; the `view` prop is untouched, so a wide screen goes back to it. A view the user picks with the switcher is respected until the screen is wide again. It uses `matchMedia` after mount (a server renders `view`); without `matchMedia` nothing changes. This replaces a hand-written `matchMedia` switch in the app.
- **Hide the agenda date.** `agendaDate={false}` hides the date beside each day's events visually (a clipped, one-pixel `<time datetime>` with `data-visually-hidden`), so a layout that shows its own date can drop it and a screen reader still gets it. Default `true`.
- **Today holds its contrast.** The reference themes mark today with a ring in the cell's own text colour (`currentColor`) and a bold number, never a fill: it stays readable on a light page, a dark page and a selected cell, and says "today" without colour. The calendar table is `table-layout: fixed` with `min-width: 0` day cells that wrap, so a phone never clips them.
- **Right-to-left.** The horizontal arrows are visual: in a right-to-left layout (the nearest `dir`) ArrowLeft goes to the next day, and Shift+Arrow and Alt+Arrow (moving an event) follow the arrow. Up, Down, Home, End and the page keys are unchanged. `isRtl` / `logicalKey` are exported.
- Tests §8.131–§8.146, including a complete Chinese bundle that must leave no English in the DOM.

## Search (0.6.0)

`search` (bindable; the field renders when `labels.search` names it) narrows the events: every word must appear, in any order, ignoring case and diacritics. New: the calendar had no search. Only matching events show, in every view (week, four-week, month, agenda); the default text is the event title and every field's text (`searchText` replaces it). The agenda wraps matches in `<mark class="calendar-view-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. Exports hold what the search leaves. See spec §17.

## Export file name

`exportFilename` (default `"calendar"`) is the base of an export's file name; `.csv`, `.tsv` or `.xlsx` is added.

## Non-goals (v1)

Event creation UI, recurring-event expansion, timezone conversion, virtualization, multi-calendar/resource views, print layout. (In-place field editing, drag and Alt+arrow rescheduling, the day and agenda views, and copy export, once listed here, have shipped.) See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out.

---

Lily™ and Lily Design System™ are trademarks.
