# KanbanTableHead

## Metadata

- Component: kanban-table-head
- PascalCase: KanbanTableHead
- Description: a kanban board table interactive grid thead for organizing items by status <thead>
- HTML tag: <thead>
- CSS class: .kanban-table-head
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: kanban-table

## Key Behaviors

- Renders as a `<div>` for the Kanban board header area
- Contains column heading elements that label each workflow stage
- Consumer provides heading content through the children slot, typically a row of heading elements
- Spreads `...restProps` onto the `<div>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- No explicit ARIA roles required -- the headings within provide their own semantic structure
- Column headings should use appropriate heading levels (e.g., `<h3>`) for proper document outline

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- column heading content for each workflow stage
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <thead> element with class="kanban-table-head"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table-head in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table-head.html
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
