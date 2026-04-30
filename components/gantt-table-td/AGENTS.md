# GanttTableTD

## Metadata

- Component: gantt-table-td
- PascalCase: GanttTableTD
- Description: a Gantt chart table interactive grid data cell for planning schedule visualization <td>
- HTML tag: <td>
- CSS class: .gantt-table-td
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<td>` element for use inside a GanttTableTR within a GanttTable grid
- Content is provided through the children slot, typically bar segments, milestone markers, or progress indicators
- Spreads `...restProps` onto the `<td>` element for consumer customization
- No internal state -- purely a structural wrapper for cell content

## ARIA

- Implicit `gridcell` role from the `<td>` element when inside a `role="grid"` table
- Consumer may add `aria-label` or `aria-describedby` for cells with visual-only content (e.g., bar segments)

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- cell content such as bar segments, milestone markers, or text
- `...restProps`: any -- additional HTML attributes spread onto the `<td>` element

## Acceptance Criteria

- [ ] Renders <td> element with class="gantt-table-td"
- [ ] Has aria-label attribute
- [ ] Has role="grid"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-td in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-td.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- WAI-ARIA gridcell role: https://www.w3.org/TR/wai-aria-1.2/#gridcell
