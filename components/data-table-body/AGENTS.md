# DataTableBody

## Metadata

- Component: data-table-body
- PascalCase: DataTableBody
- Description: a data table interactive grid tbody for displaying and sorting tabular data <tbody>
- HTML tag: <tbody>
- CSS class: .data-table-body
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<tbody>` element for the body section of a data table
- Children should be data rows, each containing cells with field values
- Designed to be used inside a DataTable `<table>` structure
- Spreads `restProps` onto the `<tbody>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<tbody>` element -- groups the body rows of the table

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- data rows representing records in the table
- `...restProps`: Any additional HTML attributes passed to the `<tbody>` element

## Acceptance Criteria

- [ ] Renders <tbody> element with class="data-table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-body in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-body.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
