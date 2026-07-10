# Container With Fluid Width

A container with fluid width spans the full width of its parent and applies
configurable horizontal padding, providing edge spacing for full-bleed
sections without imposing a maximum width.

Use it for hero sections, banners, and any layout area that should stretch
across the viewport while keeping content from sitting flush against the
screen edge.

## Implementation Notes

- Renders a `<div>` with `class="container-with-fluid-width"`
- Applies inline style `width: 100%; padding-inline: {paddingInline};`
- Sets `data-padding-inline={paddingInline}` for consumer CSS hooks
- Does not center children or constrain width — pair with `ContainerWithFixedWidth` inside if needed

## Props

- `paddingInline`: string (default: "1rem") -- horizontal padding CSS value
- `children`: slot -- the wrapped content
- `...restProps`: any additional HTML attributes

## Usage

Default 1rem padding:

```html
<ContainerWithFluidWidth>
  <Hero>...</Hero>
</ContainerWithFluidWidth>
```

Larger inline padding:

```html
<ContainerWithFluidWidth paddingInline="2rem">
  <Banner>...</Banner>
</ContainerWithFluidWidth>
```

## Keyboard Interactions

- None -- this is a structural layout container.

## ARIA

- None — purely structural.

## When to Use

- Use for full-bleed page sections that span the entire viewport width.
- Use as a wrapper around fixed-width containers to provide edge padding.
- Use when content backgrounds (color, image) need to extend edge-to-edge.

## When Not to Use

- Do not use when content must be capped at a max-width (use ContainerWithFixedWidth).
- Do not use as a generic flex/grid layout (use FlexStack or Grid).

## Headless

Provides only the full-width plus inline-padding behavior via inline styles.
Backgrounds, borders, vertical spacing, and any other visual treatment are
the consumer's responsibility.

## Styles

Consumers may target the `container-with-fluid-width` class for backgrounds,
section spacing, or responsive padding overrides.

## Testing

- Verify the component renders a `<div>` element with class `container-with-fluid-width`
- Verify the inline style includes `width: 100%` and `padding-inline: {paddingInline}`
- Verify the `data-padding-inline` attribute matches the `paddingInline` prop
- Verify children content is rendered

## Advice

- **Designers**: Use a padding scale that holds up across breakpoints; consider responsive overrides via consumer CSS for narrower viewports.
- **Developers**: Compose `ContainerWithFluidWidth` (background and edge padding) around `ContainerWithFixedWidth` (content width cap) for the common full-bleed-with-centered-content pattern.

## Related components

- `container` — a generic block-level content container
- `container-with-fixed-width` — a centered content wrapper with a fixed max-width breakpoint

## References

- MDN padding-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline

---

Lily™ and Lily Design System™ are trademarks.
