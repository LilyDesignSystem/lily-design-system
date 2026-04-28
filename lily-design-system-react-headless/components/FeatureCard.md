# FeatureCard

A large content card with a prominent image positioned alongside or above the text. Renders an `<article>` landmark with a heading, optional description, optional image, and a `children` slot for calls-to-action.

## Implementation Notes

- `heading` is **required**
- The root `<article>` exposes `aria-label` (defaulting to `heading`, overridable via `label`)
- `imagePosition` is exposed as `data-image-position` on the root for consumer styling
- The heading is rendered as an `<h3>` inside `<header>`

## Props

- `heading`: string (**required**)
- `imagePosition`: `"start" | "end" | "top"` (default `"start"`)
- `imageUrl`: string (optional)
- `imageAlt`: string (optional)
- `description`: string (optional)
- `label`: string (optional) -- `aria-label` override
- `className`: string (optional)
- `children`: ReactNode (optional) -- additional content such as CTAs
- `...restProps`: any additional HTML attributes passed to the `<article>`

## Usage

```tsx
<FeatureCard
  heading="Privacy first"
  description="Designed to protect your data."
  imageUrl="/images/feature.png"
  imageAlt="Lock illustration"
  imagePosition="start"
>
  <a href="/learn-more">Learn more</a>
</FeatureCard>
```

## ARIA

- `<article>` landmark
- `aria-label` from `label` or `heading`
