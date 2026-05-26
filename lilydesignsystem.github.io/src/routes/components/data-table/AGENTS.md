# DataTable

## Metadata

- Component: data-table
- PascalCase: DataTable
- Description: a data table interactive grid for displaying and sorting tabular data <table>
- HTML tag: <table>
- CSS class: .data-table
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: data-table-head, data-table-body, data-table-foot, data-table-th, data-table-row, data-table-td

## Key Behaviors

- Renders a semantic `<table>` element
- Conditionally renders a `<caption>` element when the `caption` prop is provided
- Uses `aria-label` only when no `caption` is present, to avoid duplicate accessible names
- Spreads `restProps` onto the `<table>` for consumer customization
- Consumers are responsible for `<thead>`, `<tbody>`, `scope` attributes on `<th>`, and all row/cell structure

## ARIA

- `aria-label={label}` -- provides an accessible name when no visible caption is present
- `<caption>` -- semantic table caption that serves as the accessible name when provided

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `caption`: string (default: undefined) -- visible caption text displayed above the table
- `label`: string (default: undefined) -- accessible label used when `caption` is not provided
- `children`: slot (required) -- table content including thead, tbody, tr, th, td elements

## Acceptance Criteria

- [ ] Renders <table> element with class="data-table"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-table.html
- WAI-ARIA Table Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- WAI Tutorial on Tables: https://www.w3.org/WAI/tutorials/tables/
