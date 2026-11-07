# CalendarYearTable

A calendar grid for the twelve months of one year (12 month cells). This is the Angular headless implementation. See `components/calendar-year-table/index.md` for the full canonical documentation.

## Contract

- Root `<table class="calendar-year-table {className}" role="grid" aria-label={label} data-view="year">` inside the `lily-calendar-year-table` host.
- Inputs: `label` (required), `caption` (optional, renders a `<caption>`), `className`.
- Content projection: reuse the `CalendarTable*` sub-elements; there are no `CalendarYearTable*` sub-elements. The consumer owns locale formatting (Intl) and cell content.
- Keyboard: arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.

## Deviation

Angular cannot spread rest props onto an inner element, so extra attributes land on the `lily-calendar-year-table` host rather than the `<table>`.
