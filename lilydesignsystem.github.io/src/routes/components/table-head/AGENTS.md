# TableHead

## Metadata

- Component: table-head
- PascalCase: TableHead
- Description: a table interactive grid thead <thead>
- HTML tag: <thead>
- CSS class: .table-head
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: table

## Key Behaviors

- Renders a `<thead>` element for table header group semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<thead>` element for consumer customization

## Keyboard

Standard table keyboard interactions.

## Props

- `className`: string (default: `""`) -- CSS class name for the header group
- `children`: slot (required) -- header rows, typically TableRow components with `<th>` cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>` element

## ARIA

- Native `<thead>` semantics group the header rows of the table
- No additional ARIA is needed for this passive structural element

## Acceptance Criteria

- [ ] Renders <thead> element with class="table-head"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .table-head in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table-head.html
- MDN thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
