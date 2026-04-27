# Masonry

A masonry-style layout container that arranges children into a configurable number of columns using the CSS `columns` model. Children with variable heights flow into columns automatically.

The component does not break individual items across columns by default. Consumer CSS should typically set `break-inside: avoid` (and `display: inline-block` or similar) on direct children to keep items intact.

## Implementation Notes

- Inline style applies `column-count` and `column-gap`
- `data-columns` attribute exposed for consumer CSS hooks
- Default columns value is `3`; default gap is `"1rem"`

## Props

- `columns`: number (default: `3`)
- `gap`: string (default: `"1rem"`) -- CSS column gap value
- `children`: ReactNode (required) -- items to lay out
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<Masonry columns={4}>
  {photos.map(p => <img key={p.id} src={p.url} alt={p.alt} />)}
</Masonry>
```

## Keyboard Interactions

- None -- passive layout container

## ARIA

- None -- transparent layout container
