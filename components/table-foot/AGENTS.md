# TableFoot

## Metadata

- Component: table-foot
- PascalCase: TableFoot
- Description: a table interactive grid tfoot <tfoot>
- HTML tag: <tfoot>
- CSS class: .table-foot
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: table

## Key Behaviors

- Renders a `<tfoot>` element for table footer group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tfoot>` element for consumer customization

## Keyboard

Standard table keyboard interactions.

## Props

- `className`: string (default: `""`) -- CSS class name for the footer group
- `children`: slot (required) -- footer rows, typically TableRow components
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>` element

## ARIA

- Native `<tfoot>` semantics group the footer rows (typically summary rows) of the table
- No additional ARIA is needed for this passive structural element

## Acceptance Criteria

- [ ] Renders <tfoot> element with class="table-foot"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .table-foot in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table-foot.html
- MDN tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
