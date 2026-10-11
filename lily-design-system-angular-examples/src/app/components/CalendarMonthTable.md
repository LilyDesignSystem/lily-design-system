# CalendarMonthTable

A calendar grid for the days of one month: week rows by seven day columns. This is the Angular headless implementation. See `components/calendar-month-table/index.md` for the full canonical documentation.

## Contract

- Root `<table class="calendar-month-table {className}" role="grid" aria-label={label} data-view="month">` inside the `lily-calendar-month-table` host.
- Inputs: `label` (required), `caption` (optional, renders a `<caption>`), `className`.
- Content projection: reuse the `CalendarTable*` sub-elements; there are no `CalendarMonthTable*` sub-elements. The consumer owns locale formatting (Intl) and cell content.
- Keyboard: none built in; the consumer implements grid navigation (arrows, Enter/Space).

## Deviation

Angular cannot spread rest props onto an inner element, so extra attributes land on the `lily-calendar-month-table` host rather than the `<table>`.
