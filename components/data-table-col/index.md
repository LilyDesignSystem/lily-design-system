# Data Table Col

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
      <DataTableCol>Name</DataTableCol>
      <DataTableCol>Role</DataTableCol>
      <DataTableCol>Status</DataTableCol>
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

- Do not use outside DataTable -- use TableCol, CalendarTableCol, GanttTableCol, or KanbanTableCol for their respective table types
- Do not use for data cells -- use DataTableData
- Do not use for column-wide styling hooks via `<colgroup>` / `<col>` -- write those directly inside DataTable

## Headless

This headless DataTableCol component provides a `<th>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.data-table-col` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<th>` element with class `data-table-col`
- Verify `scope="col"` is the default
- Verify `colspan` / `rowspan` are applied when set
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use clear, concise column-header labels.
- **Developers**: Place DataTableCol elements inside a DataTableRow within DataTableHead.

## Composition

DataTableCol is part of the DataTable composition pattern: DataTable > DataTableHead > DataTableRow > DataTableCol.

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
