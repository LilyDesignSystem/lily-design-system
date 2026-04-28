# Pictogram

An icon-based component pairing an icon with a title and description in a centered or side layout. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no styles
- Renders a `<figure>` with an `aria-hidden` icon wrapper and a `<figcaption>` containing the heading and description
- The `icon` named slot is required and intended for an SVG, image, or glyph
- Accessible name comes from the heading inside `<figcaption>` or from the `label` prop

## Props

- `layout`: `"centered" | "side"` (default `"centered"`) — exposed as `data-layout`
- `heading`: string (optional) — title rendered inside `<h3>` in the figcaption
- `description`: string (optional) — body text rendered inside a paragraph
- `label`: string (optional) — `aria-label` override
- named slot `icon` — **required**, the icon/illustration content
- default slot — additional content; overrides `description` when provided

## Usage

```vue
<Pictogram heading="Lightning fast" description="Pages render in under a second.">
    <template #icon>
        <svg viewBox="0 0 24 24"><path d="..." /></svg>
    </template>
</Pictogram>

<Pictogram heading="Custom content">
    <template #icon><svg>...</svg></template>
    <p>Use any HTML you like inside the default slot.</p>
</Pictogram>
```

## ARIA

- `<figure>` semantics
- The icon wrapper has `aria-hidden="true"` because the icon is decorative
- The accessible name comes from either the visible heading or the `label` prop

## When to Use

- Feature lists with icons next to short labels
- Marketing grids highlighting product attributes

## When Not to Use

- Functional icons that trigger actions — use `IconButton`
- Detailed cards with images and CTAs — use `FeatureCard`

## Headless

The component renders a native `<figure>` and `<figcaption>` with semantic child elements. Consumers supply the icon and all visual styling.

## Testing

- Verify the root `pictogram` class
- Verify `data-layout` defaults to `"centered"` and respects override
- Verify the icon slot renders inside an `aria-hidden` wrapper
- Verify heading and description render conditionally
- Verify default slot overrides description

## References

- [Mozilla Protocol Design System](https://protocol.mozilla.org)
- [MDN - figure](https://developer.mozilla.org/docs/Web/HTML/Element/figure)
