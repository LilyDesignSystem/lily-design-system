# CalendarTableHead

## Metadata

- Component: calendar-table-head
- PascalCase: CalendarTableHead
- Description: a calendar table interactive grid thead for managing dates, days, etc. <thead>
- Purpose: Holds the weekday headings of a calendar grid.
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <thead>
- CSS class: .calendar-table-head
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Parent: calendar-table

## Key Behaviors

- Renders as a `<thead>` element for the header section of a calendar grid
- Children should be one or more rows with `<th>` cells labeling calendar columns (e.g., days of the week)
- Designed to be used inside a CalendarTable `<table>` structure
- Spreads `restProps` onto the `<thead>` element for consumer customization
- No internal state -- purely a structural wrapper

## ARIA

- Implicit `rowgroup` role from the `<thead>` element -- groups the header rows of the grid

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- header rows, typically containing day-of-week labels
- `...restProps`: Any additional HTML attributes passed to the `<thead>` element

## Acceptance Criteria

- [ ] Renders <thead> element with class="calendar-table-head"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

Not in the Web Components catalog, by design. A custom element between a `<table>` and its sections, rows or cells
breaks the content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- Documentation: index.md
- CSS class: .calendar-table-head in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/calendar-table-head.html
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
