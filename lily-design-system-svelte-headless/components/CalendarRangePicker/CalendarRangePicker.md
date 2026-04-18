# CalendarRangePicker

A calendar range picker is a component that allows users to select a contiguous range of dates by interacting with a visual calendar grid. Commonly used in booking systems, travel planners, analytics dashboards, and reporting tools, the calendar range picker lets users define a start date and an end date by clicking or tapping on calendar cells.

This headless component renders a `<div>` with `role="application"` and an accessible label, providing a container for rich calendar-based date range selection. The consumer provides the calendar grid content, selection logic, and visual feedback as children.

## Implementation Notes

- Renders a `<div>` with `role="application"` to support rich keyboard interactions beyond standard navigation
- Consumer provides all calendar grid rendering, date selection logic, and range highlighting
- The `role="application"` signals to screen readers that the widget handles its own keyboard interactions
- Accepts `...restProps` for forwarding additional attributes to the container

## Props

- `label`: string (required) -- accessible name describing the picker purpose, applied via `aria-label`
- `children`: Snippet (required) -- the calendar grid content including date cells and navigation controls

## Usage

```svelte
<CalendarRangePicker label="Select travel dates">
    <!-- calendar grid with date cells -->
</CalendarRangePicker>
```

## Keyboard Interactions

None built-in -- the consumer should implement date cell navigation (arrow keys), selection (Enter/Space), and range extension (Shift + arrow keys or Shift + click) as appropriate.

## ARIA

- `role="application"` -- indicates that the widget manages its own keyboard interactions, overriding standard screen reader navigation
- `aria-label={label}` -- provides an accessible name for the calendar range picker

## References

- WAI-ARIA Application Role: https://www.w3.org/TR/wai-aria-1.2/#application
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
