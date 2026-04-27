# FlexStack

A flex layout container for vertical or horizontal stacking of children with a consistent gap. Use it as a primitive for toolbars, button rows, vertical content lists, and any one-dimensional layout.

## Implementation Notes

- Inline style applies `display: flex`, `flex-direction`, and `gap`
- Optional `align-items` and `justify-content` applied only when provided
- `data-direction` attribute exposed for consumer CSS hooks

## Props

- `direction`: `"row" | "column"` (default: `"column"`)
- `gap`: string (default: `"1rem"`) -- CSS gap value
- `align`: string (optional) -- `align-items` value
- `justify`: string (optional) -- `justify-content` value
- `children`: ReactNode (required) -- items to stack
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<FlexStack>
  <p>Vertically stacked.</p>
  <p>With 1rem gap.</p>
</FlexStack>

<FlexStack direction="row" align="center" justify="space-between">
  <span>Left</span>
  <span>Right</span>
</FlexStack>
```

## Keyboard Interactions

- None -- passive layout container

## ARIA

- None -- transparent layout container
