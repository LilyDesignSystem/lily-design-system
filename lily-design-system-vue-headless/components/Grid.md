# Grid

A CSS Grid layout container with configurable columns and gap. Renders a `<div class="grid">` with inline `display: grid`, `grid-template-columns`, and `gap`.

## Implementation Notes

- Headless: only inline grid styles are applied
- A numeric `columns` becomes `repeat(N, minmax(0, 1fr))`
- A string `columns` is used as the `grid-template-columns` value verbatim
- `data-columns` exposes the configured value as a CSS hook

## Props

- `columns`: number | string (default `12`)
- `gap`: string (default `"1rem"`)
- default slot — grid items
- `...$attrs` — additional HTML attributes

## Usage

```vue
<Grid :columns="3">
    <div>A</div>
    <div>B</div>
    <div>C</div>
</Grid>

<Grid columns="repeat(auto-fit, minmax(200px, 1fr))">
    <article>...</article>
</Grid>
```

## Keyboard Interactions

- None.

## ARIA

- None.

## When to Use

- Two-dimensional layouts: dashboards, galleries, card grids

## When Not to Use

- Single-axis stacks — use `FlexStack` instead
- Variable-height masonry — use `Masonry` instead

## Headless

Only `display: grid`, `grid-template-columns`, and `gap` are set inline. Consumers add visual styling via the `grid` class or attribute selectors.

## Testing

- Verify root class
- Verify default and custom columns (numeric and string)
- Verify default and custom gap
- Verify pass-through attributes

## References

- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
