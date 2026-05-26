# Gantt Table Body

## Metadata

- Component: gantt-table-tbody
- PascalCase: GanttTableTbody
- Description: a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>
- HTML tag: <tbody>
- CSS class: .gantt-table-tbody
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<tbody>` element for the body section of a Gantt chart grid
- Children should be task rows, each with a task-name cell and time-period cells
- Designed to be used inside a GanttTable `<table>` structure
- Spreads `restProps` onto the `<tbody>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<tbody>` element -- groups the body rows of the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- task rows representing items and their timeline data
- `...restProps`: Any additional HTML attributes passed to the `<tbody>` element

## Acceptance Criteria

- [ ] Renders <tbody> element with class="gantt-table-tbody"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-tbody in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-tbody.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
