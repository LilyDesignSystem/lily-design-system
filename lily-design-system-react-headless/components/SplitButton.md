# SplitButton

A button with a primary action and a dropdown trigger for related actions. Renders a `<div role="group">` containing two `<button>` elements (primary + menu trigger) and a menu container that holds the consumer-supplied menu content.

The component is fully controlled: pass `menuOpen` to reflect the dropdown state, and use `onMenuToggle` to handle clicks on the trigger button.

## Implementation Notes

- `<div role="group">` with `aria-label` from `label`
- Primary button has class `split-button-primary` and the visible `primaryLabel`
- Menu trigger has class `split-button-menu-trigger`, `aria-haspopup="menu"`, `aria-expanded={menuOpen}`, and `aria-label={menuLabel}`
- Menu container has class `split-button-menu` and uses the HTML `hidden` attribute when `menuOpen` is false
- The trigger renders no inner glyph -- consumer CSS supplies any chevron/icon

## Props

- `label`: string (**required**) -- `aria-label` for the group
- `primaryLabel`: string (**required**) -- visible text on the primary button
- `menuLabel`: string (**required**) -- `aria-label` for the menu trigger
- `menuOpen`: boolean (default: `false`)
- `disabled`: boolean (default: `false`) -- disables both buttons
- `onPrimaryClick`: (event: React.MouseEvent) => void (optional)
- `onMenuToggle`: (event: React.MouseEvent) => void (optional)
- `children`: ReactNode (optional) -- the menu content
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
const [open, setOpen] = useState(false);

<SplitButton
  label="Save options"
  primaryLabel="Save"
  menuLabel="More save options"
  menuOpen={open}
  onPrimaryClick={handleSave}
  onMenuToggle={() => setOpen(o => !o)}
>
  <Menu>
    <MenuItem onClick={saveAs}>Save as...</MenuItem>
    <MenuItem onClick={saveCopy}>Save a copy</MenuItem>
  </Menu>
</SplitButton>
```

## Keyboard Interactions

- Tab focuses the primary button; Tab again focuses the menu trigger
- Enter / Space activates either button

## ARIA

- `role="group"` with `aria-label`
- `aria-haspopup="menu"` and `aria-expanded` on the trigger
- Menu container is `hidden` when not open
