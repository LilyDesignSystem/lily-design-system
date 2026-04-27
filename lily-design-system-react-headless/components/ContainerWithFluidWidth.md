# ContainerWithFluidWidth

A full-width content wrapper that spans 100% of its parent's inline size and applies a configurable horizontal padding. Use it for headers, footers, and section bands that should run edge-to-edge while keeping their content from touching the viewport edges.

## Implementation Notes

- Inline style sets `width: 100%` and `padding-inline`
- `data-padding-inline` attribute exposed for consumer CSS hooks
- Default horizontal padding is `1rem`

## Props

- `paddingInline`: string (default: `"1rem"`) -- CSS length value
- `children`: ReactNode (required) -- content
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<ContainerWithFluidWidth>
  <header>Default 1rem horizontal padding.</header>
</ContainerWithFluidWidth>

<ContainerWithFluidWidth paddingInline="clamp(1rem, 4vw, 3rem)">
  <section>Responsive horizontal padding.</section>
</ContainerWithFluidWidth>
```

## Keyboard Interactions

- None -- passive layout container

## ARIA

- None -- transparent layout container
