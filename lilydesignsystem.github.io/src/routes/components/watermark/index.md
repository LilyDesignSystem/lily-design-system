# Watermark

A watermark is a decorative repeating overlay text or image marking a
page. The headless component exposes the props as data attributes and
the right structural ARIA; the consumer implements the actual repeating
pattern in CSS.

Use it for branding, draft markers, confidential overlays, or visual
identifiers that span a page or region.

## Implementation Notes

- Renders a `<div class="watermark">` container with `data-rotate` and `data-gap` attributes
- Inside the container, an overlay `<div class="watermark-overlay" aria-hidden="true">` carries `data-text` and `data-image-url`
- The overlay is decorative and hidden from assistive tech
- Children render after the overlay
- Consumer is responsible for the actual repeating pattern (e.g., SVG-encoded background-image)
- `gap` defaults to `"100px"` and `rotate` defaults to `-22`

## Props

- `text`: string (optional) -- watermark text
- `imageUrl`: string (optional) -- watermark image URL (alternative to text)
- `gap`: string (default: "100px") -- spacing between repeats (CSS length)
- `rotate`: number (default: -22) -- rotation angle in degrees
- `children`: slot -- content beneath the watermark
- `...restProps`: any additional HTML attributes

## Usage

```html
<Watermark text="DRAFT" rotate={-22} gap="120px">
  <article>...</article>
</Watermark>
```

```html
<Watermark imageUrl="/brand.svg" rotate={0} gap="200px">
  <main>...</main>
</Watermark>
```

## Keyboard Interactions

- None — purely decorative.

## ARIA

- The watermark overlay has `aria-hidden="true"` so screen readers ignore it
- The container itself has no role
- Underlying content remains fully accessible

## When to Use

- Use for visible-but-decorative branding or status markers (DRAFT, CONFIDENTIAL).
- Use when the watermark must repeat across a region of the page.

## When Not to Use

- Do not use for content that screen readers must announce — that content belongs in the document flow.
- Do not use as a privacy or security control — watermarks are visual only.

## Headless

Renders only the structural markup and exposes props as data attributes.
The consumer implements the repeating background pattern (e.g., a
background-image that uses an SVG generated from `data-text`) and any
animation, opacity, or color treatment.

## Styles

Consumer CSS targets `watermark` and `watermark-overlay`. Use a CSS
gradient or repeating background-image to implement the pattern;
consume `data-rotate` and `data-gap` via attribute selectors or custom
properties.

## Testing

- Verify the component renders a `<div>` element with class `watermark`
- Verify `data-rotate` reflects the `rotate` prop (default -22)
- Verify `data-gap` reflects the `gap` prop (default "100px")
- Verify the inner `<div class="watermark-overlay">` has `aria-hidden="true"`
- Verify `data-text` is set on the overlay when `text` is provided
- Verify `data-image-url` is set on the overlay when `imageUrl` is provided
- Verify children render after the overlay element

## Advice

- **Designers**: Choose a low-contrast watermark so it does not interfere with reading. Test at small and large viewports.
- **Developers**: Encode the watermark as an inline SVG background-image for crisp rendering. Use the data attributes to drive the CSS.

## Related components

- `banner` — a prominent message bar across the top of a page
- `image` — an image element with alt text

## References

- WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
- Ant Design Watermark: https://ant.design/components/watermark

---

Lily™ and Lily Design System™ are trademarks.
