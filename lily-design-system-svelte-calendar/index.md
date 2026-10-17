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

## Search (0.6.0)

`search` (bindable; the field renders when `labels.search` names it) narrows the events: every word must appear, in any order, ignoring case and diacritics. New: the calendar had no search. Only matching events show, in every view (week, four-week, month, agenda); the default text is the event title and every field's text (`searchText` replaces it). The agenda wraps matches in `<mark class="calendar-view-match">`; `labels.searchAnnouncement(matches, total)` is announced; Escape clears. Exports hold what the search leaves. See spec §17.

## Non-goals (v1)

Event creation/editing UI, drag-to-reschedule, day view, agenda/list
view, recurring-event expansion, timezone conversion, virtualization,
multi-calendar/resource views, print/export. See
[spec/index.md §9](./spec/index.md#9-non-goals) for why each is out.

---

Lily™ and Lily Design System™ are trademarks.
