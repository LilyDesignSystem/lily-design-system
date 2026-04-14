# Scroll Bar

A scroll bar is a UI component that allows users to navigate vertically or horizontally through content that extends beyond the visible area of a container. The ScrollBar component provides a headless scrollbar track element with proper ARIA scrollbar semantics, including orientation, value range, and accessible labeling.

This component renders the structural markup and ARIA attributes for a custom scrollbar. The consumer provides the visual thumb element as children and is responsible for implementing the scroll interaction logic (drag handling, position updates, and syncing with scrollable content). The component sets initial value attributes that the consumer should update dynamically.

## Implementation Notes

- Renders a `<div>` with `role="scrollbar"` and full ARIA scrollbar attributes
- Supports `"vertical"` and `"horizontal"` orientations via `aria-orientation`
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for position tracking
- Initial values are set to 0/0/100; consumer should update these dynamically
- The `label` prop provides the accessible name via `aria-label`
- Consumer provides the scrollbar thumb or track content via the `children` slot
- Rest props are spread onto the `<div>` element

## Props

- `orientation`: "vertical" | "horizontal" (default: "vertical") -- the scrollbar direction, reflected in `aria-orientation`
- `label`: string (required) -- accessible name for the scrollbar via `aria-label`
- `children`: slot (required) -- scrollbar content, typically the draggable thumb element
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Vertical scrollbar inside a chat message area:

```html
<ScrollArea label="Chat messages" style="max-height: 400px; overflow: auto;">
  <div class="messages"><!-- chat messages --></div>
  <ScrollBar orientation="vertical" label="Chat scroll">
    <div class="scroll-thumb"></div>
  </ScrollBar>
</ScrollArea>
```

Horizontal scrollbar for a timeline strip:

```html
<ScrollArea label="Project timeline" style="overflow-x: auto;">
  <div class="timeline"><!-- timeline content --></div>
  <ScrollBar orientation="horizontal" label="Timeline scroll">
    <div class="scroll-thumb"></div>
  </ScrollBar>
</ScrollArea>
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

## When to Use

- Use ScrollBar as a custom-styled scrollbar element within a ScrollArea container.
- Use ScrollBar when the native scrollbar appearance does not match your design system and you need visual consistency.
- Use ScrollBar to provide a scrollbar with full ARIA semantics for assistive technology users.

## When Not to Use

- Do not use ScrollBar outside of a ScrollArea -- it requires the scroll container context for proper functionality.
- Do not use ScrollBar when native scrollbars are sufficient -- custom scrollbars add implementation complexity for drag handling and position synchronization.

## Headless

The ScrollBar headless component provides a `<div>` with `role="scrollbar"`, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label` for full ARIA scrollbar semantics. The consumer provides the visual thumb element, drag interaction logic, and position synchronization with scrollable content.


## Styles

The consumer provides all CSS styling. The component renders with a `.scroll-bar` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `scroll-bar`
- Verify role="scrollbar"` -- identifies the element as a scrollbar control
- Verify aria-label="..."` -- provides the accessible name for the scrollbar
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the scrollbar thumb large enough to grab easily, and ensure sufficient contrast between the thumb and track for visibility.
- **Developers**: Update `aria-valuenow` dynamically as the user scrolls, and implement keyboard event handlers for arrow keys, Page Up/Down, Home, and End.

## References

- WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar
- WAI-ARIA Practices - ScrollBar: https://www.w3.org/WAI/ARIA/apd/patterns/scrollbar/
