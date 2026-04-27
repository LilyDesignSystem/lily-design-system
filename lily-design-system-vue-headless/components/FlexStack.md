# FlexStack

A flex layout container for stacking children vertically or horizontally with a consistent gap. Renders a `<div class="flex-stack">` with inline `display: flex`, configurable `flex-direction`, `gap`, and optional `align-items` / `justify-content`.

## Implementation Notes

- Headless: only inline flex layout styles are applied
- `data-direction` attribute exposes the orientation as a CSS hook

## Props

- `direction`: `"row" | "column"` (default `"column"`)
- `gap`: string (default `"1rem"`)
- `align`: string (optional) — `align-items`
- `justify`: string (optional) — `justify-content`
- default slot — children
- `...$attrs` — additional HTML attributes

## Usage

```vue
<FlexStack gap="0.5rem">
    <p>Item 1</p>
    <p>Item 2</p>
</FlexStack>

<FlexStack direction="row" align="center" justify="space-between">
    <span>Left</span>
    <span>Right</span>
</FlexStack>
```

## Keyboard Interactions

- None.

## ARIA

- None.

## When to Use

- Vertical or horizontal stacks of UI elements
- Toolbars, button rows, lists, side-by-side layouts

## When Not to Use

- Two-dimensional grids — use `Grid` instead
- Variable-height masonry — use `Masonry` instead

## Headless

Sets only flex-related inline styles. Consumers may layer additional CSS via the `flex-stack` class or `[data-direction]` selectors.

## Testing

- Verify root class
- Verify default and custom direction, gap, align, justify
- Verify pass-through attributes

## References

- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
