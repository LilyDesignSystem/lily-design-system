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

## Props

- `label`: string (required) -- accessible label for the splitter, applied via `aria-label`
- `orientation`: `"horizontal" | "vertical"` (default: `"vertical"`) -- the orientation of the split direction
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Vertical splitter between a file tree and editor:

```html
<div style="display: flex;">
  <div class="file-tree"><!-- file list --></div>
  <Splitter label="Resize file tree and editor" orientation="vertical" />
  <div class="editor"><!-- code editor --></div>
</div>
```

Horizontal splitter between a list and detail pane:

```html
<div style="display: flex; flex-direction: column;">
  <div class="email-list"><!-- email list --></div>
  <Splitter label="Resize email list and preview" orientation="horizontal" />
  <div class="email-preview"><!-- email content --></div>
</div>
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

## When to Use

- Use Splitter between two adjacent panels to provide a draggable handle for resizing, such as in code editors, file managers, or split-view layouts.
- Use Splitter when users need to adjust the relative sizes of adjacent content areas.
- Use Splitter for email or messaging interfaces with a list pane and detail pane.
- Use Splitter in IDE-style layouts separating a file tree from an editor area.

## When Not to Use

- Do not use Splitter for a single resizable container -- use Resizable instead.
- Do not use Splitter for visual dividers that do not involve resizing -- use Separator instead.
- Do not use Splitter when fixed-width panels are more appropriate for the layout.

## Headless

This headless component renders a `<div>` with `role="separator"`, keyboard focus support (`tabindex="0"`), `aria-orientation`, and value attributes (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`) for screen reader position reporting. The consumer provides all visual styling, drag behavior, keyboard handlers for arrow keys, and dynamic value updates.


## Styles

The consumer provides all CSS styling. The component renders with a `.splitter` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `splitter`
- Verify role="separator"` -- identifies the element as a separator between two regions
- Verify aria-label={label}` -- provides an accessible name describing the splitter's purpose
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the splitter handle at least 8px wide for easy grabbing, with a visible drag affordance such as dots or a grip icon. Change the cursor to `col-resize` or `row-resize` on hover.
- **Developers**: Update `aria-valuenow` dynamically as the user drags. Implement arrow key handlers to adjust position in small increments, and Home/End to jump to min/max values.

## References

- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
