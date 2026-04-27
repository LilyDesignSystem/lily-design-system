# IconButton

A button containing only an icon. Because there is no visible text, the `label` prop is **required** to give the button an accessible name via `aria-label`. Use `IconButton` for compact toolbar actions, close buttons, and other places where a glyph alone communicates the action.

## Implementation Notes

- `label` is non-optional -- icon-only buttons MUST have an accessible name
- `aria-label` is set from `label`
- Defaults to `type="button"` to avoid accidental form submissions
- `aria-pressed` rendered only when `pressed` is provided

## Props

- `label`: string (**required**) -- accessible name
- `type`: `"button" | "submit" | "reset"` (default: `"button"`)
- `disabled`: boolean (default: `false`)
- `pressed`: boolean (optional) -- toggle state via `aria-pressed`
- `onClick`: (event: React.MouseEvent) => void (optional)
- `children`: ReactNode (required) -- the icon content
- `...restProps`: Any additional HTML attributes passed to the `<button>`

## Usage

```tsx
<IconButton label="Close dialog" onClick={onClose}>
  <span aria-hidden="true">x</span>
</IconButton>

<IconButton label="Toggle mute" pressed={muted} onClick={toggleMute}>
  <MuteIcon />
</IconButton>
```

## Keyboard Interactions

- Tab: focus the button
- Enter / Space: activate the button

## ARIA

- `aria-label` from the `label` prop (required)
- `aria-pressed` when `pressed` is provided
- Native `disabled` attribute prevents activation
