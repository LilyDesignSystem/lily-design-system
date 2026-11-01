# Scroll Bar

A scroll bar is a UI component that allows users to navigate vertically or horizontally through content that extends beyond the visible area of a container. The ScrollBar component provides a headless scrollbar track element with proper ARIA scrollbar semantics, including orientation, value range, and accessible labeling.

**Status:** beta — implemented and unit-tested in all seven frameworks, with the keys in all but Nunjucks (markup only; its keys are the consumer's script), and an axe-clean demo page; not yet exercised in composed flows.

This component renders the structural markup and ARIA attributes for a custom scrollbar and owns its keyboard: the arrow, Page Up / Page Down, Home and End keys move its `value`. The consumer provides the visual thumb element as children, scrolls its content to `value`, writes `value` back as the content scrolls, and handles drag.

## Implementation Notes

- Renders a focusable `<div>` (`tabindex="0"`) with `role="scrollbar"` and full ARIA scrollbar attributes
- Supports `"vertical"` and `"horizontal"` orientations via `aria-orientation`
- Owns the scroll position: `value` (bindable; default 0) within `min`..`max` (default 0..100) is reflected in `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
- The keys move `value` by `step` (arrows) or `pageStep` (Page Up / Page Down), or to `min` / `max` (Home / End), clamped to the range, and report it (two-way binding, `onChange` in React, a bubbling `change` event in HTML, `lily:change` in Alpine, `lily-change` in Web Components)
- The consumer scrolls its content to `value`, writes `value` back as the content scrolls, and handles drag
- `controls` names the scrolled element via `aria-controls`
- The `label` prop provides the accessible name via `aria-label`
- Consumer provides the scrollbar thumb or track content via the `children` slot
- Rest props are spread onto the `<div>` element

## Props

- `orientation`: "vertical" | "horizontal" (default: "vertical") -- the scrollbar direction, reflected in `aria-orientation`
- `value`: number (default: 0) -- the scroll position, reflected in `aria-valuenow`; bindable (React: controlled `value` + `onChange`, or uncontrolled `defaultValue`)
- `min`: number (default: 0) -- the start of the range, `aria-valuemin`
- `max`: number (default: 100) -- the end of the range, `aria-valuemax`
- `step`: number (default: 1) -- the arrow-key increment
- `pageStep`: number (default: 10) -- the Page Up / Page Down increment
- `controls`: string (optional) -- the id of the scrolled element, via `aria-controls`
- `label`: string (required) -- accessible name for the scrollbar via `aria-label`
- `children`: slot (required) -- scrollbar content, typically the draggable thumb element
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

Vertical scrollbar inside a chat message area:

```html
<ScrollArea
  label="Chat messages"
  style="max-height: 400px; overflow: auto;"
>
  <div
    id="chat-messages"
    class="messages"
  >
    <!-- chat messages -->
  </div>
  <ScrollBar
    orientation="vertical"
    label="Chat scroll"
    controls="chat-messages"
    bind:value="{chatPosition}"
  >
    <div class="scroll-thumb"></div>
  </ScrollBar>
</ScrollArea>
```

Horizontal scrollbar for a timeline strip:

```html
<ScrollArea
  label="Project timeline"
  style="overflow-x: auto;"
>
  <div class="timeline"><!-- timeline content --></div>
  <ScrollBar
    orientation="horizontal"
    label="Timeline scroll"
  >
    <div class="scroll-thumb"></div>
  </ScrollBar>
</ScrollArea>
```

## Keyboard Interactions

- Arrow Up / Arrow Left: Scroll backward (decrease value) by `step`
- Arrow Down / Arrow Right: Scroll forward (increase value) by `step`
- Page Up: Scroll backward by `pageStep`
- Page Down: Scroll forward by `pageStep`
- Home: Scroll to the beginning (minimum value)
- End: Scroll to the end (maximum value)

The value is clamped to `min`..`max`. Blazor cannot cancel only some keys without JS interop, so there the keys may also scroll the page behind the scrollbar.

## ARIA

- `role="scrollbar"` -- identifies the element as a scrollbar control
- `aria-label="..."` -- provides the accessible name for the scrollbar
- `aria-orientation="vertical|horizontal"` -- indicates the scrollbar direction
- `aria-controls="..."` -- the scrolled element, when `controls` is given
- `aria-valuenow` -- the current scroll position (`value`)
- `aria-valuemin` -- the minimum scroll value (`min`)
- `aria-valuemax` -- the maximum scroll value (`max`)
- `tabindex="0"` -- the scrollbar is in the tab order so the keys reach it

## When to Use

- Use ScrollBar as a custom-styled scrollbar element within a ScrollArea container.
- Use ScrollBar when the native scrollbar appearance does not match your design system and you need visual consistency.
- Use ScrollBar to provide a scrollbar with full ARIA semantics for assistive technology users.

## When Not to Use

- Do not use ScrollBar outside of a ScrollArea -- it requires the scroll container context for proper functionality.
- Do not use ScrollBar when native scrollbars are sufficient -- custom scrollbars add implementation complexity for drag handling and position synchronization.

## Headless

The ScrollBar headless component provides a focusable `<div>` with `role="scrollbar"`, `aria-orientation`, `aria-controls`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label` for full ARIA scrollbar semantics, and moves its value on the keys. The consumer provides the visual thumb element, drag interaction logic, and position synchronization with scrollable content.

## Styles

The consumer provides all CSS styling. The component renders with a `.scroll-bar` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `scroll-bar`
- Verify role="scrollbar"` -- identifies the element as a scrollbar control
- Verify aria-label="..."` -- provides the accessible name for the scrollbar
- Verify the arrow keys move the value by `step`, Page Up / Page Down by `pageStep`, Home / End to the bounds, clamped
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the scrollbar thumb large enough to grab easily, and ensure sufficient contrast between the thumb and track for visibility.
- **Developers**: Bind `value` and scroll the content when it changes; write `value` back as the content scrolls so `aria-valuenow` stays true. Set `controls` to the scrolled element's id. Scale `min`, `max`, `step` and `pageStep` to the content (for example pixels, with `pageStep` one viewport).

## Related components

- `scroll-area` — a scrollable container with custom scrollbar support

## References

- WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar
- MDN - ARIA scrollbar role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/scrollbar_role

---

Lily™ and Lily Design System™ are trademarks.
