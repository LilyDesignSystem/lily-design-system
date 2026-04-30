# DataTableRow

## Metadata

- Component: data-table-row
- PascalCase: DataTableRow
- Description: a data table interactive grid row for displaying and sorting tabular data <tr>
- HTML tag: <tr>
- CSS class: .data-table-row
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<tr>` element for one row in a data table
- Children should be data cells (`<td>` or DataTableTD) or header cells (`<th>`)
- Designed to be used inside DataTableHead, DataTableBody, or DataTableFoot
- Spreads `restProps` onto the `<tr>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `row` role from the `<tr>` element -- identifies a row of cells within the table

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- cells for this row
- `...restProps`: Any additional HTML attributes passed to the `<tr>` element

## Acceptance Criteria

- [ ] Renders <tr> element with class="data-table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-row in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-row.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
