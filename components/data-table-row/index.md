# Data Table Row

A data table row represents a single row within a data table, typically corresponding to one record. It wraps data cells or header cells in a horizontal sequence. It is designed to be used inside a DataTableHead, DataTableBody, or DataTableFoot section.

The component renders a `<tr>` element and passes through its children, which are expected to be `<td>`, `<th>`, or DataTableTD elements.

## Implementation Notes

- Renders as a `<tr>` element for one row in a data table
- Children should be data cells (`<td>` or DataTableTD) or header cells (`<th>`)
- Designed to be used inside DataTableHead, DataTableBody, or DataTableFoot
- Spreads `restProps` onto the `<tr>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- cells for this row
- `...restProps`: Any additional HTML attributes passed to the `<tr>` element

## Usage

```html
<DataTableBody>
  <DataTableRow>
    <td>Alice</td><td>alice@example.com</td><td>Admin</td>
  </DataTableRow>
  <DataTableRow>
    <td>Bob</td><td>bob@example.com</td><td>Editor</td>
  </DataTableRow>
</DataTableBody>
```

## Keyboard Interactions

None -- this component is a passive container. Navigation within the table follows standard browser behavior.

## ARIA

- Implicit `row` role from the `<tr>` element -- identifies a row of cells within the table

## When to Use

- Use inside DataTable to provide the `<tr>` row element within DataTableHead, DataTableBody, or DataTableFoot.
- Use for each record or header row in a data table.
- Use when you need to spread additional attributes like event handlers or data attributes onto a `<tr>`.

## When Not to Use

- Do not use outside DataTable -- use TableRow, CalendarTableRow, GanttTableTR, or KanbanTableRow for their respective table types.
- Do not use as a standalone element -- it requires a parent `<thead>`, `<tbody>`, or `<tfoot>` for valid HTML.

## Headless

This headless DataTableRow component provides a semantic `<tr>` element with implicit `row` role for assistive technology. The consumer provides all visual styling including hover highlights, selected-row states, striped row backgrounds, and click interaction styles.


## Styles

The consumer provides all CSS styling. The component renders with a `.data-table-row` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tr>` element with class `data-table-row`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use hover highlights to help users track which row they are reading. Consider a selected-row state for interactive tables.
- **Developers**: Place `<td>`, `<th>`, or DataTableTD elements as children. Use `restProps` to add click handlers or data attributes for interactive row selection.

## Composition

DataTableRow is part of the DataTable composition pattern. It sits inside DataTableHead, DataTableBody, or DataTableFoot and contains DataTableTD or `<th>` elements. The full hierarchy is DataTable > DataTableHead/DataTableBody/DataTableFoot > DataTableRow > DataTableTD.

## Related components

- `data-table` — a data table interactive grid for displaying and sorting tabular data <table>
- `data-table-body` — a data table interactive grid tbody for displaying and sorting tabular data <tbody>
- `data-table-foot` — a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
- `data-table-head` — a data table interactive grid thead for displaying and sorting tabular data <thead>
- `data-table-td` — a data table interactive grid data cell for displaying and sorting tabular data <td>
- `data-table-th` — a data table interactive grid header cell for displaying and sorting tabular data <th>
- `table` — a table with rows and columns <table>

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
