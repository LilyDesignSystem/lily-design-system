# CalendarMonthTable

A calendar grid for a grid of the days of one month: week rows by seven day columns. It is a structural wrapper on a `<table role="grid">` with `data-view="month"`: the consumer supplies the head, body and rows using the existing `CalendarTable*` sub-elements, and owns every date, locale format and cell.

**Status:** beta — implemented and unit-tested in the Svelte canonical; not yet exercised in composed flows.

CalendarMonthTable is one of five calendar views alongside `CalendarTable` (the general-purpose grid). The component adds only a view-specific base class (`calendar-month-table`) and the `data-view` hook, so one stylesheet rule can lay out all five and views can be swapped without changing cell markup. Grid shape for this view: week rows by seven day columns; each cell is one day.

## Implementation Notes

- Renders `<table class="calendar-month-table {class}" role="grid" aria-label={label} data-view="month">`
- Renders a `<caption>` when `caption` is provided
- Reuses `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot`, `CalendarTableRow`, `CalendarTableTH` and `CalendarTableTD` — there are no `CalendarMonthTable*` sub-elements
- No internal state; the consumer owns locale formatting (use `Intl.DateTimeFormat`) and cell content
- Spreads `restProps` onto the root `<table>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (required) | — | Accessible name describing the period shown, e.g. a month (e.g. "January 2025") |
| `caption` | string | — | Visible `<caption>` text |
| `children` | slot (required) | — | Head, body and foot sections |
| `...restProps` | HTML attributes | — | Spread onto the root `<table>` |

## Usage

```svelte
<CalendarMonthTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow><CalendarTableTH scope="col">…</CalendarTableTH></CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableTD>…</CalendarTableTD></CalendarTableRow>
  </CalendarTableBody>
</CalendarMonthTable>
```

## Keyboard Interactions

| Key | Action |
| --- | ------ |
| — | None built-in. The consumer implements APG grid navigation: arrow keys move between cells, Home/End jump within a row, Enter/Space select |

## ARIA

- `role="grid"` identifies the table as an interactive grid
- `aria-label` (from `label`) names the period shown
- `data-view="month"` is for consumer CSS and JS, not assistive technology

## When to Use

- Showing a grid of the days of one month: week rows by seven day columns
- Scheduling, booking and planner views that switch between periods
- When several calendar views share one stylesheet and need a stable `data-view` hook

## When Not to Use

- Use `CalendarTable` when the view is not specifically month-scoped
- Use `CalendarRangePicker` to choose a date range, or `DateInput` to enter a single date
- Use `DataTable` for tabular data that is not a calendar
- Use `GanttTable` for tasks laid out across a time axis

## Headless

The component decides semantics only: the table element, the grid role, the name and the view hook. It decides nothing about layout, colour, today/selected styling, or which dates appear.

## Styles

Target `.calendar-month-table` or `[data-view="month"]` for view-specific layout. No default styles are included.

## Testing

- Renders a `<table>` with `role="grid"` and class `calendar-month-table`
- `label` sets `aria-label`; `data-view` is `month`
- `caption` renders a `<caption>` only when provided
- Children and rest props are passed through

## Advice

- Format every date with `Intl.DateTimeFormat` in the consumer; pass the already-formatted period as `label`.
- Give every cell an accessible name that includes its full date, not just the day number.
- Provide an obvious way to reach neighbouring periods (previous / next buttons outside the grid).

## Related components

- `calendar-table` — the general-purpose calendar grid and its sub-elements
- `CalendarWeekTable` for a closer look at one week
- `calendar-range-picker` / `date-input` — typing a single date

## References

- [WAI-ARIA APG: Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [WAI-ARIA APG: Date picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)

---

Lily™ and Lily Design System™ are trademarks.
