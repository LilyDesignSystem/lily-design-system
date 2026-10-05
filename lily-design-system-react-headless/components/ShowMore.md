# ShowMore

A "show more / show less" toggle for long content. The content stays in the DOM and accessibility tree; the visual clamp is consumer CSS keyed on `data-expanded` of `.show-more-content` (no inline style).

## Props

- `className`: string (optional)
- `moreLabel`, `lessLabel`: string (required, no default)
- `expanded`: boolean (default `false`); `onChange(expanded)`
- `children`: ReactNode
- `...restProps` -- spread onto the root

## Usage

```tsx
<ShowMore moreLabel="Show more" lessLabel="Show less">
  <p>Long content...</p>
</ShowMore>
```

## Keyboard Interactions

Native button: Enter / Space.

## ARIA

Button has `aria-expanded` and `aria-controls` (the content id, from `useId`).

## Related components

`Expander`, `Collapsible`.
