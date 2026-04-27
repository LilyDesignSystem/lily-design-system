# Watermark

A decorative repeating overlay text or image marking a page. The component is structural — it exposes `data-*` hooks and the consumer supplies the actual repeating-pattern CSS.

## Implementation Notes

- Headless: no CSS, no styles
- The overlay has `aria-hidden="true"` so assistive tech ignores it
- `text`, `imageUrl`, `gap`, and `rotate` are exposed as `data-*` attributes for consumer styling
- Consumer typically uses a `background-image: url(...)` with an SVG-encoded text pattern

## Props

- `text`: string — watermark text
- `imageUrl`: string — watermark image URL (alternative to text)
- `gap`: string (default `"100px"`) — spacing between repeats (CSS length)
- `rotate`: number (default `-22`) — rotation angle in degrees
- default slot — content beneath the watermark
- `...$attrs` — additional HTML attributes

## Usage

```vue
<Watermark text="CONFIDENTIAL">
    <article>…</article>
</Watermark>

<Watermark image-url="/logo.svg" gap="160px" :rotate="-15">
    <main>…</main>
</Watermark>
```

## ARIA

- The decorative overlay sets `aria-hidden="true"` so it does not pollute the accessibility tree

## When to Use

- Marking pages or documents as draft, confidential, or proprietary
- Branding overlays on shared content

## When Not to Use

- Critical security indicators — watermarks are decorative, not enforceable
- Inline meta information — use `Tag` or `Badge`

## Headless

The component renders the structural shell only. Consumers are responsible for the repeating-pattern CSS (e.g., `background-image` with SVG-encoded text), using the `data-*` hooks for configuration.

## Testing

- Verify the root `watermark` class
- Verify `data-rotate` and `data-gap` (defaults and overrides)
- Verify the `.watermark-overlay` element has `aria-hidden="true"`
- Verify `data-text` and `data-image-url` pass through
- Verify default slot rendering

## References

- [Ant Design Watermark](https://ant.design/components/watermark)
