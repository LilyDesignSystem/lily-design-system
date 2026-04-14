# Data Table Col

A data table col defines column properties for one or more columns in a data table. It allows styling or width to be applied to entire columns without repeating attributes on every cell. It is designed to be used inside a `<colgroup>` within a DataTable `<table>` structure.

The component renders a `<col>` element and supports the `span` attribute for applying properties across multiple consecutive columns.

## Implementation Notes

- Renders as a `<col>` element for defining column properties in a data table
- Should be placed inside a `<colgroup>` element within the DataTable
- The `span` prop allows a single `<col>` to apply to multiple consecutive columns
- Useful for applying consistent widths, styles, or classes to entire columns
- Spreads `restProps` onto the `<col>` element for consumer customization
- No internal state -- purely a structural element
- This is a void element and does not accept children

## Props

- `span`: number (default: 1) -- the number of consecutive columns this element spans
- `...restProps`: Any additional HTML attributes passed to the `<col>` element

## Usage

```html
<DataTable caption="Team roster">
  <colgroup>
    <DataTableCol span="1" style="width: 40%" />
    <DataTableCol span="1" style="width: 30%" />
    <DataTableCol span="1" style="width: 30%" />
  </colgroup>
  <DataTableHead>
    <tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Status</th></tr>
  </DataTableHead>
  <DataTableBody>...</DataTableBody>
</DataTable>
```

## Keyboard Interactions

None -- this component is a structural column definition and is not interactive.

## ARIA

- No implicit ARIA role -- `<col>` is a structural element used for column styling and does not convey semantics to assistive technologies

## When to Use

- Use inside DataTable to provide the `<col>` column definition within a `<colgroup>`.
- Use to apply consistent widths or styles to entire columns without repeating attributes on every cell.
- Use when column sizing needs to be defined declaratively rather than through cell-level styles.

## When Not to Use

- Do not use outside DataTable -- use TableCol, CalendarTableCol, GanttTableCol, or KanbanTableCol for their respective table types.
- Do not use when column styling is handled entirely through CSS classes on cells -- it adds unnecessary markup.

## Headless

This headless DataTableCol component provides a `<col>` element with a `span` attribute for applying properties across multiple consecutive columns. The consumer provides all visual styling including column widths, background colors, and any other column-level CSS.


## Styles

The consumer provides all CSS styling. The component renders with a `.data-table-col` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<th>` element with class `data-table-col`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Define consistent column proportions to maintain a balanced table layout. Use percentage-based widths for responsive tables.
- **Developers**: Place DataTableCol elements inside a `<colgroup>` within the DataTable. Use the `span` attribute to apply one `<col>` definition across multiple consecutive columns.

## Composition

DataTableCol is part of the DataTable composition pattern. It sits inside a `<colgroup>` within a DataTable, alongside DataTableHead, DataTableBody, and DataTableFoot sections. It applies column-level properties that affect all cells in the specified columns.

## References

- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
