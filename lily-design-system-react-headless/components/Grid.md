# Grid

A CSS grid layout container with a configurable column count or a custom `grid-template-columns` string. When the `columns` prop is a number, the component generates `repeat(N, minmax(0, 1fr))`. When it is a string, the string is used as-is for flexible track definitions.

## Implementation Notes

- Inline style applies `display: grid`, `grid-template-columns`, and `gap`
- `data-columns` attribute exposed for consumer CSS hooks
- Default columns value is `12`

## Props

- `columns`: `number | string` (default: `12`)
- `gap`: string (default: `"1rem"`) -- CSS gap value
- `children`: ReactNode (required) -- grid items
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<Grid columns={3}>
  <div>1</div>
  <div>2</div>
  <div>3</div>
</Grid>

<Grid columns="200px 1fr 200px" gap="2rem">
  <aside>Left</aside>
  <main>Center</main>
  <aside>Right</aside>
</Grid>
```

## Keyboard Interactions

- None -- passive layout container

## ARIA

- None -- transparent layout container; do not use `role="grid"` for non-interactive layouts
