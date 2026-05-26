# DataTableTD

## Metadata

- Component: data-table-td
- PascalCase: DataTableTD
- Description: a data table interactive grid data cell for displaying and sorting tabular data <td>
- HTML tag: <td>
- CSS class: .data-table-td
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<td>` element for a single data cell in a table row
- Children are the cell content (text, numbers, or other elements)
- Designed to be used inside DataTableRow or `<tr>` within a DataTable
- Spreads `restProps` onto the `<td>` element for consumer customization (e.g., `colspan`, `rowspan`, `headers`)
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `cell` role from the `<td>` element -- identifies the element as a cell within a table row

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- cell content
- `...restProps`: Any additional HTML attributes passed to the `<td>` element

## Acceptance Criteria

- [ ] Renders <td> element with class="data-table-td"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-td in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-td.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
