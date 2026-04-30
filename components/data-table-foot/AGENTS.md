# DataTableFoot

## Metadata

- Component: data-table-foot
- PascalCase: DataTableFoot
- Description: a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
- HTML tag: <tfoot>
- CSS class: .data-table-foot
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<tfoot>` element for the footer section of a data table
- Children should be one or more rows providing summary or aggregate information
- Designed to be used inside a DataTable `<table>` structure
- Spreads `restProps` onto the `<tfoot>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<tfoot>` element -- groups the footer rows of the table

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- footer rows with summary or aggregate content
- `...restProps`: Any additional HTML attributes passed to the `<tfoot>` element

## Acceptance Criteria

- [ ] Renders <tfoot> element with class="data-table-foot"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-foot in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-foot.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
