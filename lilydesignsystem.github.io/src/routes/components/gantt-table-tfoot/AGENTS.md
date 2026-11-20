# Gantt Table Foot

## Metadata

- Component: gantt-table-tfoot
- PascalCase: GanttTableTfoot
- Description: a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
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

## Known limitations

Not in the Web Components catalog, by design. A custom element between a `<table>` and its sections, rows or cells
breaks the content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- Documentation: index.md
- CSS class: .gantt-table-tfoot in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/gantt-table-tfoot.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
