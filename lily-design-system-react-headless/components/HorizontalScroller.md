# HorizontalScroller

A horizontally scrollable region. Renders a `<div role="region">` with `tabindex=0` so keyboard users can focus the area, and handles `ArrowLeft` / `ArrowRight` to scroll horizontally inside it. Pointer / touch scrolling is left to the browser's native overflow behaviour (which the consumer enables via `overflow-x: auto` in CSS).

## Props

- `className`: string (optional) — CSS class appended to `horizontal-scroller`
- `label`: string (required) — accessible label for the scrollable region
- `step`: number (default `100`) — pixels to scroll per Arrow key press
- `children`: ReactNode (required) — horizontally arranged content
- `...restProps`: unknown — additional attributes spread onto the `<div>`

## Keyboard

- `ArrowRight` — scroll right by `step` pixels
- `ArrowLeft` — scroll left by `step` pixels
- `Home` — scroll to the start
- `End` — scroll to the end

## Usage

```tsx
<HorizontalScroller label="Featured stories" step={200}>
  <article>Story 1</article>
  <article>Story 2</article>
  <article>Story 3</article>
</HorizontalScroller>
```

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
