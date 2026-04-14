# Data Table Data

A data table data cell represents a single piece of data within a data table row. It holds the value for one field of a record. It is designed to be used inside a DataTableRow or `<tr>` within a DataTable structure.

The component renders a `<td>` element and passes through its children, which are the cell content.

## Implementation Notes

- Renders as a `<td>` element for a single data cell in a table row
- Children are the cell content (text, numbers, or other elements)
- Designed to be used inside DataTableRow or `<tr>` within a DataTable
- Spreads `restProps` onto the `<td>` element for consumer customization (e.g., `colspan`, `rowspan`, `headers`)
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- cell content
- `...restProps`: Any additional HTML attributes passed to the `<td>` element

## Usage

```html
<DataTableRow>
  <DataTableData>Alice</DataTableData>
  <DataTableData>alice@example.com</DataTableData>
  <DataTableData>Admin</DataTableData>
</DataTableRow>
```

## Keyboard Interactions

None -- this component is a passive container. Navigation within the table follows standard browser behavior.

## ARIA

- Implicit `cell` role from the `<td>` element -- identifies the element as a cell within a table row

## When to Use

- Use inside DataTable to provide the `<td>` data cell within a DataTableRow.
- Use for each field value in a record row.
- Use when you need to spread additional attributes like `colspan`, `rowspan`, or `headers` onto a `<td>`.

## When Not to Use

- Do not use outside DataTable -- use TableData, CalendarTableData, GanttTableData, or KanbanTableData for their respective table types.
- Do not use for header cells -- use a `<th>` element with `scope` instead.

## Headless

This headless DataTableData component provides a semantic `<td>` element with implicit `cell` role for assistive technology. The consumer provides all visual styling including text alignment, padding, borders, truncation, and responsive behavior.


## Styles

The consumer provides all CSS styling. The component renders with a `.data-table-data` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<td>` element with class `data-table-data`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Right-align numeric data and left-align text data for easy scanning. Use consistent padding and consider truncation with tooltips for long values.
- **Developers**: Use `colspan` and `rowspan` via `restProps` for spanning cells. Link cells to their headers with the `headers` attribute for complex table structures.

## Composition

DataTableData is the leaf component in the DataTable composition pattern. It sits inside a DataTableRow. The full hierarchy is DataTable > DataTableHead/DataTableBody/DataTableFoot > DataTableRow > DataTableData.

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
