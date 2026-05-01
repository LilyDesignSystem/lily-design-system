# Gantt Table Foot

## Metadata

- Component: gantt-table-tfoot
- PascalCase: GanttTableTfoot
- Description: a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
- HTML tag: <tfoot>
- CSS class: .gantt-table-tfoot
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<tfoot>` element for the footer section of a Gantt chart grid
- Children should be one or more rows providing summary, milestone, or aggregate information
- Designed to be used inside a GanttTable `<table>` structure
- Spreads `restProps` onto the `<tfoot>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<tfoot>` element -- groups the footer rows of the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- footer rows with summary or milestone content
- `...restProps`: Any additional HTML attributes passed to the `<tfoot>` element

## Acceptance Criteria

- [ ] Renders <tfoot> element with class="gantt-table-tfoot"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-tfoot in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-tfoot.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
