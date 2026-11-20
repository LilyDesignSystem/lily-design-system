# TableRow

## Metadata

- Component: table-row
- PascalCase: TableRow
- Description: a table interactive grid row <tr>
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
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

## Known limitations

Not in the Web Components catalog, by design. A custom element between a `<table>` and its sections, rows or cells
breaks the content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- Documentation: index.md
- CSS class: .table-row in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table-row.html
- MDN tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
