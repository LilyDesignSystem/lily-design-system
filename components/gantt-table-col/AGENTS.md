# Gantt Table Col

## Metadata

- Component: gantt-table-col
- PascalCase: GanttTableCol
- Description: a Gantt chart table interactive grid column for planning schedule visualization <th>
- HTML tag: <th>
- CSS class: .gantt-table-col
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<col>` element for use inside a `<colgroup>` within a GanttTable
- Used to define column-level properties such as width, span, and CSS class for time period columns
- The `span` attribute allows a single `<col>` to apply properties across multiple consecutive columns
- Spreads `...restProps` onto the `<col>` element for consumer customization
- No children -- `<col>` is a void element

## ARIA

- No explicit ARIA roles or attributes -- the `<col>` element is a structural table component that does not appear in the accessibility tree

## Props

- `span`: number (default: 1) -- number of consecutive columns this element spans
- `...restProps`: any -- additional HTML attributes spread onto the `<col>` element

## Acceptance Criteria

- [ ] Renders <th> element with class="gantt-table-col"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-col in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-col.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- HTML `<col>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
