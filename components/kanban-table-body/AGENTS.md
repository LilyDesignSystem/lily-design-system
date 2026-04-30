# KanbanTableBody

## Metadata

- Component: kanban-table-body
- PascalCase: KanbanTableBody
- Description: a kanban board table interactive grid tbody for organizing items by status <tbody>
- HTML tag: <tbody>
- CSS class: .kanban-table-body
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: kanban-table

## Key Behaviors

- Renders as a `<div>` for the main Kanban board content area
- Consumer provides column containers and card items through the children slot
- Each column within the body typically uses `role="list"` with KanbanTableTD items as `role="listitem"` children
- Spreads `...restProps` onto the `<div>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- No explicit ARIA roles required on the body container itself
- Column containers within should use `role="list"` with `aria-label` to identify each workflow stage
- Card items within columns should use `role="listitem"` (provided by KanbanTableTD)

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- column containers with card content
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <tbody> element with class="kanban-table-body"
- [ ] Has aria-label attribute
- [ ] Has role="list"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table-body in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table-body.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
