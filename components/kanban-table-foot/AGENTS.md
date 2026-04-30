# KanbanTableFoot

## Metadata

- Component: kanban-table-foot
- PascalCase: KanbanTableFoot
- Description: a kanban board table interactive grid tfoot for organizing items by status <tfoot>
- HTML tag: <tfoot>
- CSS class: .kanban-table-foot
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: kanban-table

## Key Behaviors

- Renders as a `<div>` for the Kanban board footer area
- Optional component -- only include when the board needs footer-level actions or summaries
- Consumer provides footer content through the children slot
- Spreads `...restProps` onto the `<div>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- No explicit ARIA roles required on the footer container itself
- Interactive elements within the footer (e.g., buttons) provide their own semantics

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- footer content such as action buttons, item counts, or summary information
- `...restProps`: any -- additional HTML attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <tfoot> element with class="kanban-table-foot"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table-foot in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table-foot.html
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
