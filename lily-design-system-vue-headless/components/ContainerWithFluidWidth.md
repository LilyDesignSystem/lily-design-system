# ContainerWithFluidWidth

A full-width content wrapper that applies configurable horizontal padding (`padding-inline`) so content does not touch the viewport edges. Renders a `<div class="container-with-fluid-width">` with a `data-padding-inline` attribute and inline `width: 100%` and `padding-inline` styles.

## Implementation Notes

- Headless: only inline `width: 100%` and `padding-inline` are applied
- `data-padding-inline` exposes the configured value for consumer CSS hooks

## Props

- `paddingInline`: string (default `"1rem"`) — horizontal padding CSS value
- default slot — content
- `...$attrs` — additional HTML attributes

## Usage

```vue
<ContainerWithFluidWidth>
    <p>Edge-to-edge content</p>
</ContainerWithFluidWidth>

<ContainerWithFluidWidth padding-inline="clamp(1rem, 5vw, 4rem)">
    <header>...</header>
</ContainerWithFluidWidth>
```

## Keyboard Interactions

- None.

## ARIA

- None.

## When to Use

- Full-bleed page sections, banners, headers, footers
- Any container that should fill the viewport width

## When Not to Use

- When content must be centered with a maximum width — use `ContainerWithFixedWidth` instead

## Headless

Sets only `width: 100%` and `padding-inline`. All other styling is left to the consumer.

## Testing

- Verify root class
- Verify `data-padding-inline` defaults and overrides
- Verify inline `padding-inline` and `width: 100%` styles

## References

- [MDN: padding-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline)
