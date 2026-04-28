# FeatureCard

A large content card with a prominent image positioned alongside or above the text. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no styles
- Renders an `<article>` landmark with `aria-label` (defaults to heading)
- `heading` is **required** and non-optional in the TypeScript interface
- Image position is exposed as `data-image-position` for styling

## Props

- `heading`: string (**required**) — card heading rendered inside an `<h3>`
- `imagePosition`: `"start" | "end" | "top"` (default `"start"`) — image position relative to text
- `imageUrl`: string (optional) — image URL
- `imageAlt`: string (optional) — image alt text
- `description`: string (optional) — body text rendered in a paragraph
- `label`: string (optional) — `aria-label` override (defaults to `heading`)
- default slot — additional content (e.g., CTAs)

## Usage

```vue
<FeatureCard
    heading="Privacy first"
    description="Mozilla products put your privacy first."
    image-url="/img/privacy.png"
    image-alt=""
    image-position="start"
>
    <a href="/privacy">Read more</a>
</FeatureCard>
```

## ARIA

- `<article>` landmark
- `aria-label` defaults to the heading; can be overridden via the `label` prop

## When to Use

- Marketing pages highlighting product features
- Long-form pages introducing major capabilities

## When Not to Use

- Compact item lists — use `Tile` or `Card`
- Hero sections — use `Hero` or `HeroHeadline`

## Headless

The component renders a native `<article>` with semantic child elements (`<header>`, `<h3>`, `<p>`, `<img>`). Consumers supply all visual styling.

## Testing

- Verify the root `feature-card` class
- Verify the heading renders as `<h3>`
- Verify `aria-label` defaults to heading and respects override
- Verify image renders only when `imageUrl` is provided
- Verify description renders only when provided

## References

- [Mozilla Protocol Design System](https://protocol.mozilla.org)
