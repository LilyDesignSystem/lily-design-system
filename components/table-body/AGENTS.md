# TableBody

## Metadata

- Component: table-body
- PascalCase: TableBody
- Description: a table interactive grid tbody <tbody>
- HTML tag: <tbody>
- CSS class: .table-body
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: table

## Key Behaviors

- Renders a `<tbody>` element for table body group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tbody>` element for consumer customization

## Keyboard

Standard table keyboard interactions.

## Props

- `className`: string (default: `""`) -- CSS class name for the body group
- `children`: slot (required) -- data rows, typically TableRow components
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>` element

## ARIA

- Native `<tbody>` semantics group the body rows of the table
- No additional ARIA is needed for this passive structural element

## Acceptance Criteria

- [ ] Renders <tbody> element with class="table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .table-body in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table-body.html
- MDN tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
