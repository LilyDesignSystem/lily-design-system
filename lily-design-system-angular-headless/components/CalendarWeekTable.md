# CalendarWeekTable

A calendar grid for the seven days of one week as day columns. This is the Angular headless implementation. See `components/calendar-week-table/index.md` for the full canonical documentation.

## Contract

- Root `<table class="calendar-week-table {className}" role="grid" aria-label={label} data-view="week">` inside the `lily-calendar-week-table` host.
- Inputs: `label` (required), `caption` (optional, renders a `<caption>`), `className`.
- Content projection: reuse the `CalendarTable*` sub-elements; there are no `CalendarWeekTable*` sub-elements. The consumer owns locale formatting (Intl) and cell content.
- Keyboard: none built in; the consumer implements grid navigation (arrows, Enter/Space).

## Deviation

Angular cannot spread rest props onto an inner element, so extra attributes land on the `lily-calendar-week-table` host rather than the `<table>`.
