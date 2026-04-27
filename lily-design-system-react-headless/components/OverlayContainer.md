# OverlayContainer

A full-viewport overlay backdrop for modals, sheets, and drawers. Renders a presentational `<div role="presentation">` that is hidden when `open` is `false`. The component does not provide any visual styling itself -- consumer CSS is responsible for the backdrop fill and positioning. The dialog/sheet/menu placed inside provides its own role (typically `role="dialog"` with `aria-modal="true"`).

## Implementation Notes

- `<div role="presentation">` -- the overlay is decorative; the actual dialog inside has `role="dialog"`
- `aria-hidden` is the inverse of `open`
- `hidden` attribute applied when not open
- `data-open` attribute exposed for consumer CSS hooks

## Props

- `open`: boolean (default: `false`) -- whether the overlay is visible
- `label`: string (optional) -- `aria-label`
- `onClick`: (event: React.MouseEvent) => void (optional) -- typically a backdrop-close handler
- `children`: ReactNode (optional) -- the overlay content
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<OverlayContainer open={isOpen} onClick={() => setIsOpen(false)}>
  <div role="dialog" aria-modal="true" aria-labelledby="title">
    <h2 id="title">Confirm action</h2>
    ...
  </div>
</OverlayContainer>
```

## Keyboard Interactions

- None on the overlay itself; the contained dialog handles `Escape` and focus trapping

## ARIA

- `role="presentation"` -- decorative wrapper
- `aria-hidden` reflects the inverse of `open`
- Optional `aria-label` via `label` prop
