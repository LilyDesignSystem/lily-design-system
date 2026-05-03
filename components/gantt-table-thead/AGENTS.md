# Gantt Table Head

## Metadata

- Component: gantt-table-thead
- PascalCase: GanttTableThead
- Description: a Gantt chart table interactive grid thead for planning schedule visualization <thead>
- HTML tag: <thead>
- CSS class: .gantt-table-thead
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: gantt-table

## Key Behaviors

- Renders as a `<thead>` element for the header section of a Gantt chart grid
- Children should be one or more rows with `<th>` cells labeling the task column and time-period columns
- Designed to be used inside a GanttTable `<table>` structure
- Spreads `restProps` onto the `<thead>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<thead>` element -- groups the header rows of the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- header rows containing column labels for tasks and time periods
- `...restProps`: Any additional HTML attributes passed to the `<thead>` element

## Acceptance Criteria

- [ ] Renders <thead> element with class="gantt-table-thead"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .gantt-table-thead in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-thead.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
