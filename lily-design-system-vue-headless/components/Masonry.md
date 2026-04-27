# Masonry

A masonry layout container that arranges variable-height children into balanced columns using CSS Multi-column Layout (`column-count` + `column-gap`).

## Implementation Notes

- Headless: only inline `column-count` and `column-gap` are applied
- Consumers must set `break-inside: avoid` on children to prevent splitting
- `data-columns` exposes the configured value as a CSS hook

## Props

- `columns`: number (default `3`)
- `gap`: string (default `"1rem"`)
- default slot — items
- `...$attrs` — additional HTML attributes

## Usage

```vue
<Masonry :columns="3">
    <img src="..." />
    <img src="..." />
</Masonry>

<Masonry :columns="4" gap="0.5rem">
    <article>...</article>
</Masonry>
```

## Keyboard Interactions

- None.

## ARIA

- None.

## When to Use

- Image galleries, mixed-height card boards, Pinterest-style feeds

## When Not to Use

- Uniform-height grids — use `Grid` instead
- Single-axis stacks — use `FlexStack` instead

## Headless

Sets only `column-count` and `column-gap` inline. Consumers must apply `.masonry > * { break-inside: avoid; }` (or similar) for correct rendering.

## Testing

- Verify root class
- Verify default and custom columns and gap
- Verify pass-through attributes

## References

- [MDN: CSS Multi-column Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout)
