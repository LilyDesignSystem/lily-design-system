# KanbanTable

## Metadata

- Component: kanban-table
- PascalCase: KanbanTable
- Description: a kanban board table interactive grid for organizing items by status <table>
- HTML tag: <table>
- CSS class: .kanban-table
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: kanban-table-head, kanban-table-body, kanban-table-foot, kanban-table-th, kanban-table-row, kanban-table-td

## Key Behaviors

- Renders a `<div>` with `role="region"` to define a named landmark for the Kanban board
- Consumer provides column containers and item cards as children
- The region role with a label allows screen reader users to navigate directly to the board
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## ARIA

- `role="region"` -- defines the Kanban board as a named landmark section
- `aria-label={label}` -- provides an accessible name for the board region

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the board, applied via `aria-label`
- `children`: slot (required) -- the board content including columns and cards

## Acceptance Criteria

- [ ] Renders <table> element with class="kanban-table"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table.html
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
