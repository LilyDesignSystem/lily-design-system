# Data Table TH

A data table col is a column header cell in a DataTable. It renders a `<th scope="col">` element and is intended to live inside a DataTableRow within DataTableHead.

## Implementation Notes

- Renders as a `<th>` element with `scope="col"` by default
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: any additional HTML attributes passed to the `<th>` element

## Usage

```html
<DataTable label="Team roster">
  <DataTableHead>
    <DataTableRow>
      <DataTableTD>Name</DataTableTD>
      <DataTableTD>Role</DataTableTD>
      <DataTableTD>Status</DataTableTD>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>...</DataTableBody>
</DataTable>
```

## Keyboard Interactions

None -- this component is a header cell and is not interactive.

## ARIA

- `scope="col"` associates the header with its column for assistive technologies
- Use `scope="colgroup"` together with `colspan` for grouped column headers

## When to Use

- For column header cells in the header row of a DataTable
- For grouped header cells via `colspan` / `rowspan`

## When Not to Use

- Do not use outside DataTable -- use TableTD, CalendarTableTD, GanttTableTH, or KanbanTableTD for their respective table types
- Do not use for data cells -- use DataTableTD
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside DataTable

## Headless

This headless DataTableTD component provides a `<th>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.data-table-th` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<th>` element with class `data-table-th`
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use clear, concise column-header labels.
- **Developers**: Place DataTableTD elements inside a DataTableRow within DataTableHead.

## Composition

DataTableTD is part of the DataTable composition pattern: DataTable > DataTableHead > DataTableRow > DataTableTD.

## Related components

- `data-table` — a data table interactive grid for displaying and sorting tabular data <table>
- `data-table-body` — a data table interactive grid tbody for displaying and sorting tabular data <tbody>
- `data-table-foot` — a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
- `data-table-head` — a data table interactive grid thead for displaying and sorting tabular data <thead>
- `data-table-row` — a data table interactive grid row for displaying and sorting tabular data <tr>
- `data-table-td` — a data table interactive grid data cell for displaying and sorting tabular data <td>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

---

Lily™ and Lily Design System™ are trademarks.
