# KanbanTable

## Metadata

- Component: kanban-table
- PascalCase: KanbanTable
- Description: a kanban board table interactive grid for organizing items by status <table>
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <table>
- CSS class: .kanban-table
- Interactive: yes

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: kanban-table-head, kanban-table-body, kanban-table-foot, kanban-table-th, kanban-table-row, kanban-table-td

## Key Behaviors

- Renders a `<table role="grid">`, named by `label`; its cells are `gridcell`s, and a `<table>` root replaced the `<div role="region">` this contract once described
- Consumer provides column containers and item cards as children
- Accepts `...restProps` for forwarding additional attributes to the container
- Owns the grid keys below, over the cells the consumer renders; a root inside `[data-consumer-keys]` attaches none, for a consumer running its own
- No other state

## ARIA

- `role="grid"` -- the board is a grid of cells
- `aria-label={label}` -- provides an accessible name for the board

## Keyboard

- Tab: moves to the board, on its one tab stop, and out of it
- ArrowRight / ArrowLeft: next or previous column, swapped in right-to-left; stops at the edge
- ArrowDown / ArrowUp: next or previous row; stops at the edge
- Home / End: first or last cell in the row
- Ctrl+Home / Ctrl+End (Cmd on macOS): first or last cell on the board
- PageDown / PageUp: ten rows, stopping at the edge
- Enter or F2: go to the first control in the cell, which keeps its own keys
- Escape: from a control, back to its cell
- Moving a card between columns is the consumer's: `kanban-board` uses Alt+Arrow

## Props

- `label`: string (required) -- accessible name describing the board, applied via `aria-label`
- `children`: slot (required) -- the board content including columns and cards

## Acceptance Criteria

- [ ] Renders <table> element with class="kanban-table"
- [ ] Has aria-label attribute
- [ ] Has role="grid"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table.html
- WAI-ARIA grid role: https://www.w3.org/TR/wai-aria-1.2/#grid
