# DataTableTH

## Metadata

- Component: data-table-th
- PascalCase: DataTableTH
- Description: a data table interactive grid header cell for displaying and sorting tabular data <th>
- HTML tag: <th>
- CSS class: .data-table-th
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<th>` element with `scope="col"` by default
- Intended to live inside a DataTableRow within DataTableHead, where it labels a column
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## ARIA

- `scope="col"` associates the header with its column for assistive technologies
- Use `scope="colgroup"` together with `colspan` for grouped column headers

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: Any additional HTML attributes passed to the `<th>` element

## Acceptance Criteria

- [ ] Renders <th> element with class="data-table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-th in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-th.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
