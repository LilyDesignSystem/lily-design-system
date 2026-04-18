# ScrollBar

A scrollbar is a UI component that allows users to navigate vertically or horizontally through content that extends beyond the visible area of a container. The ScrollBar component provides a headless scrollbar track element with proper ARIA scrollbar semantics, including orientation, value range, and accessible labeling.

This component renders the structural markup and ARIA attributes for a custom scrollbar. The consumer provides the visual thumb element as children and is responsible for implementing the scroll interaction logic (drag handling, position updates, and syncing with scrollable content). The component sets initial value attributes that the consumer should update dynamically.

## Implementation Notes

- Renders a `<div>` with `role="scrollbar"` and full ARIA scrollbar attributes
- Supports `"vertical"` and `"horizontal"` orientations via `aria-orientation`
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for position tracking
- Initial values are set to 0/0/100; consumer should update these dynamically
- The `label` prop provides the accessible name via `aria-label`
- Consumer provides the scrollbar thumb or track content via the `children` snippet
- Rest props are spread onto the `<div>` element

## Props

- `orientation`: "vertical" | "horizontal" (default: "vertical") -- the scrollbar direction, reflected in `aria-orientation`
- `label`: string (required) -- accessible name for the scrollbar via `aria-label`
- `children`: Snippet (required) -- scrollbar content, typically the draggable thumb element
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<!-- Vertical scrollbar -->
<ScrollBar orientation="vertical" label="Page scroll">
  <div><!-- thumb element --></div>
</ScrollBar>

<!-- Horizontal scrollbar -->
<ScrollBar orientation="horizontal" label="Timeline scroll">
  <div><!-- thumb element --></div>
</ScrollBar>
```

## Keyboard Interactions

- Arrow Up / Arrow Left: Scroll backward (decrease value) by a small increment
- Arrow Down / Arrow Right: Scroll forward (increase value) by a small increment
- Page Up: Scroll backward by a large increment
- Page Down: Scroll forward by a large increment
- Home: Scroll to the beginning (minimum value)
- End: Scroll to the end (maximum value)

Note: The consumer is responsible for implementing keyboard event handlers that update the scrollbar value.

## ARIA

- `role="scrollbar"` -- identifies the element as a scrollbar control
- `aria-label="..."` -- provides the accessible name for the scrollbar
- `aria-orientation="vertical|horizontal"` -- indicates the scrollbar direction
- `aria-valuenow="0"` -- the current scroll position (consumer should update dynamically)
- `aria-valuemin="0"` -- the minimum scroll value
- `aria-valuemax="100"` -- the maximum scroll value

## References

- WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar
- WAI-ARIA Practices - ScrollBar: https://www.w3.org/WAI/ARIA/apd/patterns/scrollbar/
