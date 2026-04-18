# Splitter

Splitter is a headless separator element used between resizable panels. It uses the ARIA `separator` role to indicate a draggable divider, with keyboard focus support and value tracking for reporting the current split position to assistive technologies.

Use Splitter between two adjacent panels to provide a visual and interactive handle for resizing. The component renders the necessary ARIA attributes for screen readers to announce the separator's orientation and current position. Consumer is responsible for implementing the actual drag-to-resize behavior, visual styling, and updating the value attributes based on user interaction.

## Implementation Notes

- Renders a `<div>` element with `role="separator"` for ARIA semantics
- Sets `tabindex="0"` to make the separator keyboard-focusable
- Includes `aria-orientation` to indicate whether the split is horizontal or vertical
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for communicating the current split position as a percentage (default: 50, min: 0, max: 100)
- Consumer should update `aria-valuenow` dynamically as the user drags the splitter
- Consumer is responsible for implementing keyboard handlers (arrow keys to adjust position) and pointer/drag handlers
- Spreads `restProps` onto the div for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing

## Props

- `label`: string (required) -- accessible label for the splitter, applied via `aria-label`
- `orientation`: `"horizontal" | "vertical"` (default: `"vertical"`) -- the orientation of the split direction
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<Splitter label="Resize panels" orientation="vertical" />
```

## Keyboard Interactions

- Tab: Moves focus to the splitter
- Arrow keys: Consumer should implement arrow key handling to adjust the split position (Left/Right for horizontal, Up/Down for vertical)
- Home: Consumer should implement to set the splitter to the minimum position
- End: Consumer should implement to set the splitter to the maximum position

## ARIA

- `role="separator"` -- identifies the element as a separator between two regions
- `aria-label={label}` -- provides an accessible name describing the splitter's purpose
- `aria-orientation={orientation}` -- indicates whether the separator divides content horizontally or vertically
- `aria-valuenow={50}` -- reports the current position of the splitter as a percentage
- `aria-valuemin={0}` -- the minimum allowed position value
- `aria-valuemax={100}` -- the maximum allowed position value

## References

- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
