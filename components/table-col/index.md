# Table Col

TableCol is a headless component that renders a `<col>` element within a table column group. It applies column-level attributes and styling hooks.

Use this component within a Table `<colgroup>` to define column properties such as width or class.

## Implementation Notes

- Renders a `<col>` element for column-level styling within a `<colgroup>`
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<col>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the column
- `...restProps`: unknown -- additional attributes spread onto the `<col>` element

## Usage

```html
<Table label="Data">
  <colgroup>
    <TableCol />
    <TableCol />
  </colgroup>
</Table>
```

## Keyboard Interactions

None. Column elements are not interactive.

## ARIA

No ARIA attributes. Column elements are structural, not semantic.

## When to Use

- Use inside TableRow within TableHead as a `<th>` column header with appropriate `scope` attribute
- Use inside TableRow within TableBody as a `<th>` row header with `scope="row"`
- Use within a Table `<colgroup>` to define column-level properties such as width or class

## When Not to Use

- Do not use for data cells -- use TableData for `<td>` elements
- Do not use outside of a Table -- use DataTableCol for DataTable or CalendarTableCol for CalendarTable

## Headless

This headless component renders a `<col>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-col` class for targeting.

## Testing

- Verify the component renders a `<col>` element
- Verify pass-through attributes are applied

## Composition

TableCol is a child of Table, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableData.

## References

- MDN col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
