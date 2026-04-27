# FloatButton

A floating action button anchored to a viewport corner. Inline `style` is `position: fixed` plus the corner offsets (`1rem` from each edge of the chosen corner).

## Implementation Notes

- `label` is non-optional -- icon-only buttons MUST have an accessible name
- Inline `style` is required: `position: fixed` and corner offsets
- `data-position` is exposed for consumer CSS hooks
- Default `type` is `"button"` to avoid accidental form submissions

## Props

- `label`: string (**required**) -- aria-label
- `position`: `"top-left" | "top-right" | "bottom-left" | "bottom-right"` (default: `"bottom-right"`)
- `disabled`: boolean (default: `false`)
- `type`: `"button" | "submit" | "reset"` (default: `"button"`)
- `onClick`: (event: React.MouseEvent) => void (optional)
- `children`: ReactNode (required) -- icon content
- `...restProps`: Any additional HTML attributes passed to the `<button>`

## Usage

```tsx
<FloatButton label="Scroll to top" position="bottom-right" onClick={onTop}>
  <ArrowUpIcon />
</FloatButton>
```

## Keyboard Interactions

- Tab: focus the button
- Enter / Space: activate the button

## ARIA

- `aria-label` from the `label` prop (required)
- Native `disabled` attribute prevents activation
