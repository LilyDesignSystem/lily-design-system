# KanbanTableRow

## Metadata

- Component: kanban-table-row
- PascalCase: KanbanTableRow
- Description: a kanban board table interactive grid row for organizing items by status <tr>
- HTML tag: <tr>
- CSS class: .kanban-table-row
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: kanban-table

## Key Behaviors

- Renders a `<tr>` element for table row semantics
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<tr>` element for consumer customization

## Keyboard

Standard table row keyboard interactions.

## Props

- `className`: string (default: `""`) -- CSS class name for the row
- `children`: slot (required) -- row cells, typically KanbanTableTD components
- `...restProps`: unknown -- additional attributes spread onto the `<tr>` element

## ARIA

- Native `<tr>` semantics announce the row position within the kanban table
- Screen readers expose the `<tr>` row as part of the surrounding `<table>` grid

## Acceptance Criteria

- [ ] Renders <tr> element with class="kanban-table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table-row in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table-row.html
- MDN tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr
