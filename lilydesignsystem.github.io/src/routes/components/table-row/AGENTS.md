# TableRow

## Metadata

- Component: table-row
- PascalCase: TableRow
- Description: a table interactive grid row <tr>
- HTML tag: <tr>
- CSS class: .table-row
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: table

## Key Behaviors

- Renders a `<tr>` element for table row semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tr>` element for consumer customization

## Keyboard

Standard table row keyboard interactions.

## Props

- `className`: string (default: `""`) -- CSS class name for the row
- `children`: slot (required) -- row cells, typically `<th>` or TableTD components
- `...restProps`: unknown -- additional attributes spread onto the `<tr>` element

## ARIA

- Native `<tr>` semantics announce the row position within the surrounding `<table>`
- Screen readers expose `<tr>` as a row in the data grid

## Acceptance Criteria

- [ ] Renders <tr> element with class="table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .table-row in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table-row.html
- MDN tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
