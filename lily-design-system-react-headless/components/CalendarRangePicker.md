# CalendarRangePicker

A calendar range picker is a component that allows users to select a contiguous range of dates by interacting with a visual calendar grid. Commonly used in booking systems, travel planners, analytics dashboards, and reporting tools, the calendar range picker lets users define a start date and an end date by clicking or tapping on calendar cells.

This headless component renders a `<div>` with `role="group"` and an accessible label, providing a container for rich calendar-based date range selection. The consumer provides the calendar grid content, selection logic, and visual feedback as children.

## Implementation Notes

- Renders a `<div>` with `role="group"`, naming the controls the consumer puts inside it
- Consumer provides all calendar grid rendering, date selection logic, and range highlighting
- The `role="group"` leaves screen readers' reading keys working, so a calendar with no keys of its own stays readable; put `role="grid"` on the calendar itself if the consumer adds arrow keys
- Accepts `...restProps` for forwarding additional attributes to the container

## Props

- `label`: string (required) -- accessible name describing the picker purpose, applied via `aria-label`
- `children`: ReactNode (required) -- the calendar grid content including date cells and navigation controls

## Usage

```tsx
<CalendarRangePicker label="Select travel dates">
  {/* calendar grid with date cells */}
</CalendarRangePicker>
```

## Keyboard Interactions

None built-in -- the consumer should implement date cell navigation (arrow keys), selection (Enter/Space), and range extension (Shift + arrow keys or Shift + click) as appropriate.

## ARIA

- `role="group"` -- groups the calendar controls under `aria-label`, and does not take over screen reader navigation
- `aria-label={label}` -- provides an accessible name for the calendar range picker

## References

- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
