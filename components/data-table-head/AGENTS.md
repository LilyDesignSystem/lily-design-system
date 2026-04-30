# DataTableHead

## Metadata

- Component: data-table-head
- PascalCase: DataTableHead
- Description: a data table interactive grid thead for displaying and sorting tabular data <thead>
- HTML tag: <thead>
- CSS class: .data-table-head
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: data-table

## Key Behaviors

- Renders as a `<thead>` element for the header section of a data table
- Children should be one or more rows with `<th scope="col">` cells labeling table columns
- Designed to be used inside a DataTable `<table>` structure
- Spreads `restProps` onto the `<thead>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<thead>` element -- groups the header rows of the table

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- header rows containing column labels
- `...restProps`: Any additional HTML attributes passed to the `<thead>` element

## Acceptance Criteria

- [ ] Renders <thead> element with class="data-table-head"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table-head in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table-head.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
