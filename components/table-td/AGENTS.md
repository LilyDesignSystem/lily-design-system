# TableTD

## Metadata

- Component: table-td
- PascalCase: TableTD
- Description: a table interactive grid data cell <td>
- HTML tag: <td>
- CSS class: .table-td
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: table

## Key Behaviors

- Renders a `<td>` element for table data cell semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<td>` element for consumer customization

## Keyboard

Standard table cell keyboard interactions.

## Props

- `className`: string (default: `""`) -- CSS class name for the cell
- `children`: slot (required) -- cell content
- `...restProps`: unknown -- additional attributes spread onto the `<td>` element

## ARIA

- Native `<td>` exposes a data cell within the surrounding `<table>`
- Screen readers announce the cell value alongside the relevant column / row header

## Acceptance Criteria

- [ ] Renders <td> element with class="table-td"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .table-td in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table-td.html
- MDN td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td
