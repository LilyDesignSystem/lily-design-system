# Data Table Col

## Metadata

- Component: data-table-col
- PascalCase: DataTableCol
- Description: a data table interactive grid column for displaying and sorting tabular data <th>
- HTML tag: <th>
- CSS class: .data-table-col
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<col>` element for defining column properties in a data table
- Should be placed inside a `<colgroup>` element within the DataTable
- The `span` prop allows a single `<col>` to apply to multiple consecutive columns
- Useful for applying consistent widths, styles, or classes to entire columns
- Spreads `restProps` onto the `<col>` element for consumer customization
- No internal state -- purely a structural element
- This is a void element and does not accept children

## ARIA

- No implicit ARIA role -- `<col>` is a structural element used for column styling and does not convey semantics to assistive technologies

## Props

- `span`: number (default: 1) -- the number of consecutive columns this element spans
- `...restProps`: Any additional HTML attributes passed to the `<col>` element

## Acceptance Criteria

- [ ] Renders <th> element with class="data-table-col"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-col in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-col.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
