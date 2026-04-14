# Data Table Body

A data table body is the main content section of a data table, wrapping the rows that contain the data cells. It groups the data rows where each row represents a record and each cell represents a field value. It is designed to be used inside a DataTable `<table>` structure.

The component renders a `<tbody>` element and passes through its children, which are expected to be DataTableRow or `<tr>` elements containing data cells.

## Implementation Notes

- Renders as a `<tbody>` element for the body section of a data table
- Children should be data rows, each containing cells with field values
- Designed to be used inside a DataTable `<table>` structure
- Spreads `restProps` onto the `<tbody>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- data rows representing records in the table
- `...restProps`: Any additional HTML attributes passed to the `<tbody>` element

## Usage

```html
<DataTable caption="User accounts">
  <DataTableHead>...</DataTableHead>
  <DataTableBody>
    <tr><td>Alice</td><td>alice@example.com</td><td>Admin</td></tr>
    <tr><td>Bob</td><td>bob@example.com</td><td>Editor</td></tr>
  </DataTableBody>
</DataTable>
```

## Keyboard Interactions

None -- this component is a passive container. Navigation within the table follows standard browser behavior.

## ARIA

- Implicit `rowgroup` role from the `<tbody>` element -- groups the body rows of the table

## When to Use

- Use inside DataTable to provide the `<tbody>` body section containing data rows.
- Use to wrap the main data rows, separating them from header and footer sections.
- Use for each logical group of data rows within a table.

## When Not to Use

- Do not use outside DataTable -- use TableBody, CalendarTableBody, GanttTableBody, or KanbanTableBody for their respective table types.
- Do not use for header rows -- use DataTableHead instead.

## Headless

This headless DataTableBody component provides a semantic `<tbody>` element with implicit `rowgroup` role for assistive technology. The consumer provides all visual styling including row backgrounds, hover states, striping patterns, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.data-table-body` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tbody>` element with class `data-table-body`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use alternating row colors or subtle borders within the body section to help users track data across columns.
- **Developers**: Place DataTableRow or `<tr>` elements as children. The `<tbody>` groups body rows separately from header and footer rows for assistive technology navigation.

## Composition

DataTableBody is part of the DataTable composition pattern. It sits inside a DataTable and contains DataTableRow components. The full hierarchy is DataTable > DataTableHead/DataTableBody/DataTableFoot > DataTableRow > DataTableData.

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
