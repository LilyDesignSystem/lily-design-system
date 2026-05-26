# KanbanTableTH

## Metadata

- Component: kanban-table-th
- PascalCase: KanbanTableTH
- Description: a kanban board table interactive grid header cell for organizing items by status <th>
- HTML tag: <th>
- CSS class: .kanban-table-th
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: kanban-table

## Key Behaviors

- Renders a `<th>` element with `scope="col"` by default
- Intended to live inside a KanbanTableRow within KanbanTableHead, where it labels a workflow stage column
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `restProps` onto the `<th>` element

## ARIA

- `scope="col"` associates the header with its workflow column for assistive technologies

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>` element

## Acceptance Criteria

- [ ] Renders <th> element with class="kanban-table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kanban-table-th in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kanban-table-th.html
- MDN th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
