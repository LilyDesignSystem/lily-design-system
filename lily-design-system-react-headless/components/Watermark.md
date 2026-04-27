# Watermark

A decorative repeating overlay text or image marking a page. The headless component exposes the configuration as `data-*` attributes on a sibling overlay element with `aria-hidden="true"`. The consumer is responsible for the actual repeating-pattern CSS (e.g. `background-image` with SVG-encoded text) -- this component only provides the structure and ARIA contract.

## Implementation Notes

- The overlay is a sibling `<div class="watermark-overlay">` with `aria-hidden="true"` so it is never announced
- Configuration is exposed as `data-text`, `data-image-url`, `data-gap`, `data-rotate` for consumer CSS
- Both `text` and `imageUrl` are optional; supply whichever the consumer's CSS expects

## Props

- `text`: string (optional) -- watermark text
- `imageUrl`: string (optional) -- watermark image URL
- `gap`: string (default: `"100px"`) -- spacing between repeats
- `rotate`: number (default: `-22`) -- rotation angle in degrees
- `children`: ReactNode (optional) -- content beneath the watermark
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<Watermark text="Confidential" rotate={-22} gap="120px">
  <article>…page content…</article>
</Watermark>
```

## Keyboard Interactions

None -- decorative.

## ARIA

- The overlay has `aria-hidden="true"` so the watermark is purely decorative for assistive tech
