# Masonry

A masonry container arranges variable-height children in vertical columns
using CSS multi-column layout, producing a Pinterest-style staggered grid
without requiring JavaScript-based positioning.

Use it for image galleries, photo packs, card boards, and any collection of
items whose heights differ and where you want the layout to fill column gaps
naturally.

## Implementation Notes

- Renders a `<div>` with `class="masonry"`
- Applies inline style `column-count: {columns}; column-gap: {gap};`
- Sets `data-columns={columns}` for consumer CSS hooks
- Children should set `break-inside: avoid` (or `page-break-inside: avoid`) via consumer CSS to prevent splits across columns
- Source order determines fill order (top-down within each column)

## Props

- `columns`: number (default: 3) -- number of columns
- `gap`: string (default: "1rem") -- gap CSS value
- `children`: slot -- masonry items
- `...restProps`: any additional HTML attributes

## Usage

Default three-column masonry:

```html
<Masonry>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Masonry>
```

Two columns with larger gap:

```html
<Masonry columns={2} gap="2rem">
  <PhotoPack>...</PhotoPack>
  <PhotoPack>...</PhotoPack>
</Masonry>
```

## Keyboard Interactions

- None -- this is a layout container; focusable children manage their own keyboard behavior.

## ARIA

- None — purely structural.

## When to Use

- Use for grids of variable-height items where uniform rows are not required.
- Use for galleries, photo packs, and card boards where natural column packing reads better than a strict grid.

## When Not to Use

- Do not use when items must align across rows (use Grid).
- Do not use when item order across rows must be strictly left-to-right (CSS columns flow top-down within each column, which can be surprising).
- Do not use for one-dimensional stacks (use FlexStack).

## Headless

Provides only the column-count layout via inline styles. Item-level
break-inside behavior, sizing, and visual treatment are the consumer's
responsibility.

## Styles

A typical consumer adds `break-inside: avoid` to direct children:

```css
.masonry > * {
  break-inside: avoid;
  margin-bottom: 1rem;
}
```

## Testing

- Verify the component renders a `<div>` element with class `masonry`
- Verify inline style sets `column-count` to the `columns` prop
- Verify inline style sets `column-gap` to the `gap` prop
- Verify `data-columns` attribute matches the `columns` prop
- Verify children content is rendered

## Advice

- **Designers**: CSS-columns masonry flows top-down within each column. If left-to-right reading order matters, use Grid instead.
- **Developers**: Always pair Masonry with `break-inside: avoid` on the items so cards do not split across columns. Consider responsive overrides on `column-count` for narrow viewports.

## Related components

- `grid` — a CSS grid layout container with configurable columns and gap
- `flex-stack` — a flex layout container for vertical or horizontal stacking with consistent gap

## References

- MDN column-count: https://developer.mozilla.org/en-US/docs/Web/CSS/column-count
- MDN break-inside: https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside

---

Lily™ and Lily Design System™ are trademarks.
