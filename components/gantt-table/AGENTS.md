# GanttTable

## Metadata

- Component: gantt-table
- PascalCase: GanttTable
- Description: a Gantt chart table interactive grid for planning schedule visualization <table>
- HTML tag: <table>
- CSS class: .gantt-table
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: gantt-table-thead, gantt-table-tbody, gantt-table-tfoot, gantt-table-th, gantt-table-tr, gantt-table-td

## Key Behaviors

- Renders a `<table>` element with `role="grid"` for structured task/timeline grid semantics
- Consumer provides `<tr>` rows for tasks and `<td>`/`<th>` cells for time periods
- The grid structure allows screen readers to navigate tasks and time periods systematically
- Accepts `...restProps` for forwarding additional attributes to the table element
- No internal state -- purely a structural wrapper

## ARIA

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the Gantt chart

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the Gantt chart content, applied via `aria-label`
- `children`: slot (required) -- table rows and cells representing tasks and timelines

## Acceptance Criteria

- [ ] Renders <table> element with class="gantt-table"
- [ ] Has aria-label attribute
- [ ] Has role="grid"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
