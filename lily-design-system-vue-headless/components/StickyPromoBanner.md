# StickyPromoBanner

A fixed-position promotional banner with a dismiss button. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no `<style>` blocks
- Renders an `<aside role="complementary">` with `aria-label`
- Inline `style` is used **only** to apply `position: fixed`, `left: 0`, `right: 0`, and either `top: 0` or `bottom: 0` based on the `position` prop. All other visual styling is consumer-supplied.
- `label` and `dismissLabel` are **required** and non-optional in the TypeScript interface
- Always renders the dismiss button (consumers can hide via CSS if they choose to handle dismissal another way)

## Props

- `label`: string (**required**) — `aria-label` for the aside region
- `open`: boolean (default `true`) — toggles the `hidden` attribute
- `position`: `"top" | "bottom"` (default `"bottom"`) — sticky edge of the viewport, exposed as `data-position` and reflected in the inline edge style
- `dismissLabel`: string (**required**) — `aria-label` for the dismiss button
- default slot — banner content

## Events

- `dismiss(event: MouseEvent)` — emitted when the dismiss button is clicked

## Usage

```vue
<StickyPromoBanner
    label="Holiday promotion"
    dismiss-label="Dismiss promotion"
    :open="open"
    position="bottom"
    @dismiss="onDismiss"
>
    Save 20% today only — <a href="/promo">claim your code</a>.
</StickyPromoBanner>
```

## ARIA

- `<aside role="complementary">` is a landmark for tangential content
- `aria-label` provides the accessible name for the region
- The dismiss button has its own `aria-label`

## When to Use

- Site-wide promotional banners that stick to the top or bottom of the viewport
- Cookie consent prompts, announcements, time-limited offers

## When Not to Use

- Critical alerts that require acknowledgment — use `AlertDialog`
- In-page status messages — use `Banner`

## Headless

The component renders the layout primitives needed to position the banner. Consumers supply all decorative styling (colors, padding, typography, transitions). The required `position: fixed` styles are inline so the component works without any consumer CSS.

## Testing

- Verify the root `sticky-promo-banner` class and `role="complementary"`
- Verify the inline `position: fixed` style and edge (`top` vs `bottom`)
- Verify the `hidden` attribute toggles with the `open` prop
- Verify the dismiss button has the correct `aria-label`
- Verify the `dismiss` event fires on click

## References

- [Mozilla Protocol Design System](https://protocol.mozilla.org)
- [MDN - aside element](https://developer.mozilla.org/docs/Web/HTML/Element/aside)
