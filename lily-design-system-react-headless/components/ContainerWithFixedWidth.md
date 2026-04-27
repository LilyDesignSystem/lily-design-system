# ContainerWithFixedWidth

A centered content wrapper that constrains its children to a fixed maximum width and horizontally centers itself within its parent using `margin-inline: auto`. Use it as the outer wrapper of a page section or article when you want a consistent reading width on large viewports.

## Implementation Notes

- Inline style sets `max-width` and `margin-inline: auto`
- `data-max-width` attribute exposed for consumer CSS hooks
- Default max width is `1200px`

## Props

- `maxWidth`: string (default: `"1200px"`) -- CSS length value
- `children`: ReactNode (required) -- content
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<ContainerWithFixedWidth>
  <article>Default 1200px width article.</article>
</ContainerWithFixedWidth>

<ContainerWithFixedWidth maxWidth="960px">
  <main>Narrower main content.</main>
</ContainerWithFixedWidth>
```

## Keyboard Interactions

- None -- passive layout container

## ARIA

- None -- transparent layout container
