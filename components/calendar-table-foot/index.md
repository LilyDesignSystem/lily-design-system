# Calendar Table Foot

A calendar table foot is the footer section of a calendar grid, wrapping one or more rows that provide supplementary information such as week totals, summary data, or navigation controls. It is designed to be used inside a CalendarTable `<table>` structure.

The component renders a `<tfoot>` element and passes through its children, which are expected to be CalendarTableRow or `<tr>` elements.

## Implementation Notes

- Renders as a `<tfoot>` element for the footer section of a calendar grid
- Children should be one or more rows providing summary or supplementary information
- Designed to be used inside a CalendarTable `<table>` structure
- Spreads `restProps` onto the `<tfoot>` element for consumer customization
- No internal state -- purely a structural wrapper

## Props

- `children`: slot (required) -- footer rows with summary or supplementary content
- `...restProps`: Any additional HTML attributes passed to the `<tfoot>` element

## Usage

```html
<CalendarTable label="April 2026">
  <CalendarTableHead>...</CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
  <CalendarTableFoot>
    <CalendarTableRow>
      <td colspan="7">5 events this month</td>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

```html
<CalendarTableFoot>
  <CalendarTableRow>
    <td colspan="3"><button type="button">Previous month</button></td>
    <td>April 2026</td>
    <td colspan="3"><button type="button">Next month</button></td>
  </CalendarTableRow>
</CalendarTableFoot>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by the parent CalendarTable grid.

## ARIA

- Implicit `rowgroup` role from the `<tfoot>` element -- groups the footer rows of the grid

## When to Use

- Use inside CalendarTable to provide the `<tfoot>` for the calendar grid
- Use to display supplementary information such as event counts, week totals, or month navigation controls
- Use when you need to separate summary content from the main calendar body

## When Not to Use

- Do not use outside CalendarTable -- use TableFoot or DataTableFoot for other table types
- Do not use for day-of-week labels -- use CalendarTableHead for column headers

## Headless

This component provides a semantic `<tfoot>` element with implicit `rowgroup` role and zero visual styling. The consumer is responsible for all CSS including row spacing, cell layout, background color, and any visual distinction from the body rows.


## Styles

The consumer provides all CSS styling. The component renders with a `.calendar-table-foot` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<tfoot>` element with class `calendar-table-foot`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use the footer for supplementary information that does not compete with the day cells. Keep footer content concise and secondary in visual hierarchy.
- **Developers**: Use `colspan` on footer cells when the content spans the full width of the calendar grid. The footer is optional in most calendar layouts.

## Composition

CalendarTableFoot is part of the CalendarTable composition pattern:

- **CalendarTable** -- outer `<table>` with `role="grid"`.
- **CalendarTableHead** -- `<thead>` for column headers.
- **CalendarTableBody** -- `<tbody>` for day rows.
- **CalendarTableFoot** -- `<tfoot>` for summary or navigation content.
- **CalendarTableRow** -- `<tr>` within any section.

```html
<CalendarTable label="January 2025">
  <CalendarTableHead>...</CalendarTableHead>
  <CalendarTableBody>...</CalendarTableBody>
  <CalendarTableFoot>
    <tr><td colspan="7">5 events this month</td></tr>
  </CalendarTableFoot>
</CalendarTable>
```

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
