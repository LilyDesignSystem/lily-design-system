# Pictogram

An icon-based component pairing an icon with a title and description in a centered or side layout. Renders a semantic `<figure>` whose icon is decorative (`aria-hidden`) and whose accessible name comes from the heading or `label`.

## Implementation Notes

- `icon` is a **required** ReactNode prop, **not** `children`
- `children` (when provided) overrides `description`
- The `.pictogram-icon` wrapper is `aria-hidden="true"` because the icon is decorative
- `layout` is exposed as `data-layout` for consumer styling
- The heading is rendered as an `<h3>` inside `<figcaption>`

## Props

- `icon`: ReactNode (**required**) -- the icon/illustration
- `layout`: `"centered" | "side"` (default `"centered"`)
- `heading`: string (optional)
- `description`: string (optional)
- `label`: string (optional) -- `aria-label` override
- `className`: string (optional)
- `children`: ReactNode (optional) -- overrides `description`
- `...restProps`: any additional HTML attributes passed to the `<figure>`

## Usage

```tsx
<Pictogram
  icon={<MyIcon />}
  heading="Privacy first"
  description="Designed to protect your data."
/>

<Pictogram icon={<svg>...</svg>} layout="side" heading="Side layout">
  <p>Custom body content overrides description.</p>
</Pictogram>
```

## ARIA

- `<figure>` semantics
- Icon wrapper has `aria-hidden="true"`
- `aria-label` from `label` (optional override)
