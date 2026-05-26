# GanttTableTH

## Metadata

- Component: gantt-table-th
- PascalCase: GanttTableTH
- Description: a Gantt chart table interactive grid header cell for planning schedule visualization <th>
- HTML tag: <th>
- CSS class: .gantt-table-th
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<th>` element with `scope="col"` by default
- Intended to live inside a GanttTableTR within GanttTableHead, where it labels a time-period column
- Accepts optional `colspan` / `rowspan` for grouped header cells
- Accepts an alternative `scope` (e.g. `"colgroup"` for grouped headers)
- Renders header text via children
- Spreads `...restProps` onto the `<th>` element

## ARIA

- `scope="col"` associates the header with its column for assistive technologies
- Use `scope="colgroup"` together with `colspan` for grouped column headers (e.g. quarter spanning months)

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default: `"col"`) -- header scope
- `children`: optional -- header cell content
- `...restProps`: any -- additional HTML attributes spread onto the `<th>` element

## Acceptance Criteria

- [ ] Renders <th> element with class="gantt-table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-th in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-th.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- HTML `<th>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
