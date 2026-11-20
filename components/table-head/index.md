# Table Head

TableHead is a headless component that renders a `<thead>` element within a table. It groups header rows that define column labels.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

Use this component within a Table to define the header section containing column headings.

## Implementation Notes

- Renders a `<thead>` element for table header group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<thead>` element for consumer customization

## Props

- `className`: string (default: `""`) -- CSS class name for the header group
- `children`: slot (required) -- header rows, typically TableRow components with `<th>` cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>` element

## Usage

```html
<table label="Users">
  <TableHead>
    <TableRow>
      <th>Name</th>
      <th>Email</th>
    </TableRow>
  </TableHead>
</table>
```

## Keyboard Interactions

Standard table keyboard interactions.

## ARIA

No additional ARIA attributes. Header semantics are provided by the `<thead>` element.

## When to Use

- Use inside Table to wrap the header row(s) that label each column
- Use to group `<th>` cells with `scope="col"` that define column headings
- Use to provide a visually distinct header section that screen readers can navigate to

## When Not to Use

- Do not use outside of a Table -- use DataTableHead for DataTable or CalendarTableHead for CalendarTable
- Do not use for footer summary rows -- use TableFoot instead

## Headless

This headless component renders a `<thead>` element. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.table-head` class for targeting.

## Testing

- Verify the component renders a `<thead>` element
- Verify children content is rendered
- Verify pass-through attributes are applied

## Composition

TableHead is a child of Table, following the Table pattern: Table > TableHead/TableBody/TableFoot > TableRow > TableTD.

## Related components

- `table` — a table with rows and columns <table>
- `table-body` — a table interactive grid tbody <tbody>
- `table-foot` — a table interactive grid tfoot <tfoot>
- `table-row` — a table interactive grid row <tr>
- `table-td` — a table interactive grid data cell <td>
- `table-th` — a table interactive grid column <th>

## Known limitations

Not in the Web Components catalog, by design. A custom element between a `<table>` and its sections, rows or cells
breaks the content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- MDN thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

---

Lily™ and Lily Design System™ are trademarks.
