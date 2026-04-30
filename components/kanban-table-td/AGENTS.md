# KanbanTableTD

## Metadata

- Component: kanban-table-td
- PascalCase: KanbanTableTD
- Description: kanban board table interactive grid data cell for organizing items by status <td>
- HTML tag: <td>
- CSS class: .kanban-table-td
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: kanban-table

## Key Behaviors

- Renders as a `<div>` with `role="listitem"` for proper list semantics within a parent `role="list"` container
- Designed to be used inside a Kanban column; the parent column provides the `role="list"` context
- Optional `label` prop sets `aria-label` for screen reader identification of the card
- All card content is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- No drag-and-drop behavior built in; consumers implement interaction as needed

## ARIA

- `role="listitem"` -- identifies this as an item within a list container (the parent Kanban column with `role="list"`)
- `aria-label` -- optional accessible name for the card, set from the `label` prop, allowing screen readers to identify individual cards

## Keyboard

- None directly -- keyboard interaction depends on interactive elements within the card content provided by the consumer

## Props

- `label`: string (optional) -- accessible label for the card via `aria-label`
- `children`: slot (required) -- card content (title, assignee, metadata, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <td> element with class="kanban-table-td"
- [ ] Has aria-label attribute
- [ ] Has role="listitem"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table-td in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table-td.html
- WAI-ARIA Listitem Role: https://www.w3.org/TR/wai-aria-1.2/#listitem
