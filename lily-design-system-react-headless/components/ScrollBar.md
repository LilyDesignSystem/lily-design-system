# ScrollBar

A scrollbar is a UI component that allows users to navigate vertically or horizontally through content that extends beyond the visible area of a container. The ScrollBar component provides a headless scrollbar track element with proper ARIA scrollbar semantics, including orientation, value range, and accessible labeling.

This component renders the structural markup and ARIA attributes for a custom scrollbar and owns its keyboard: the arrow, Page Up / Page Down, Home and End keys move its value. The consumer provides the visual thumb element as children, scrolls its content to the value, writes the value back as the content scrolls, and handles drag.

## Implementation Notes

- Renders a focusable `<div>` (`tabindex="0"`) with `role="scrollbar"` and full ARIA scrollbar attributes
- Supports `"vertical"` and `"horizontal"` orientations via `aria-orientation`
- Reflects the value, `min` and `max` in `aria-valuenow`, `aria-valuemin` and `aria-valuemax`; the keys move the value, clamped
- `controls` names the scrolled element via `aria-controls`
- The `label` prop provides the accessible name via `aria-label`
- Consumer provides the scrollbar thumb or track content via the `children` snippet
- Rest props are spread onto the `<div>` element

## Props

- `orientation`: "vertical" | "horizontal" (default: "vertical") -- the scrollbar direction, reflected in `aria-orientation`
- `value`: number (optional) -- the scroll position; controlled when given
- `defaultValue`: number (default: 0) -- the starting position when uncontrolled
- `onChange`: (value: number) => void (optional) -- called with the new value on a key
- `min` / `max`: number (default: 0 / 100) -- the range
- `step`: number (default: 1) -- the arrow-key increment
- `pageStep`: number (default: 10) -- the Page Up / Page Down increment
- `controls`: string (optional) -- the scrolled element's id, via `aria-controls`
- `label`: string (required) -- accessible name for the scrollbar via `aria-label`
- `children`: ReactNode (required) -- scrollbar content, typically the draggable thumb element
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```tsx
{
  /* Vertical scrollbar */
}
<ScrollBar
  orientation="vertical"
  label="Page scroll"
  controls="page-content"
  value={position}
  onChange={setPosition}
>
  <div>{/* thumb element */}</div>
</ScrollBar>;

{
  /* Horizontal scrollbar */
}
<ScrollBar
  orientation="horizontal"
  label="Timeline scroll"
>
  <div>{/* thumb element */}</div>
</ScrollBar>;
```

## Keyboard Interactions

- Arrow Up / Arrow Left: Scroll backward (decrease value) by `step`
- Arrow Down / Arrow Right: Scroll forward (increase value) by `step`
- Page Up: Scroll backward by `pageStep`
- Page Down: Scroll forward by `pageStep`
- Home: Scroll to the beginning (minimum value)
- End: Scroll to the end (maximum value)

The value is clamped to `min`..`max`.

## ARIA

- `role="scrollbar"` -- identifies the element as a scrollbar control
- `aria-label="..."` -- provides the accessible name for the scrollbar
- `aria-orientation="vertical|horizontal"` -- indicates the scrollbar direction
- `aria-controls="..."` -- the scrolled element, when `controls` is given
- `aria-valuenow` -- the current scroll position
- `aria-valuemin` / `aria-valuemax` -- the range (`min` / `max`)

## References

- WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar
- MDN - ARIA scrollbar role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/scrollbar_role
