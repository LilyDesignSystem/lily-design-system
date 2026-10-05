# CalendarDayTable

A calendar grid for the time slots of one day: one row per slot. This is the Angular headless implementation. See `components/calendar-day-table/index.md` for the full canonical documentation.

## Contract

- Root `<table class="calendar-day-table {className}" role="grid" aria-label={label} data-view="day">` inside the `lily-calendar-day-table` host.
- Inputs: `label` (required), `caption` (optional, renders a `<caption>`), `className`.
- Content projection: reuse the `CalendarTable*` sub-elements; there are no `CalendarDayTable*` sub-elements. The consumer owns locale formatting (Intl) and cell content.
- Keyboard: none built in; the consumer implements grid navigation (arrows, Enter/Space).

## Deviation

Angular cannot spread rest props onto an inner element, so extra attributes land on the `lily-calendar-day-table` host rather than the `<table>`.
