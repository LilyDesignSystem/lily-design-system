# ActionGroup

A group of action buttons that can collapse to an overflow menu when space is constrained. Inspired by Adobe Spectrum's ActionGroup.

## Implementation Notes

- Renders a `<div>` with `role="group"` and `aria-label`
- The visible action buttons are passed via `children`
- The overflow menu content is passed via the `overflow` prop (a separate slot, **not** `children`)
- The overflow trigger and panel are only rendered when `overflow` is provided
- The trigger has `aria-haspopup="menu"` and `aria-expanded` reflecting `overflowOpen`

## Props

- `label`: string (**required**) — aria-label for the group
- `overflowOpen`: boolean (default: `false`) — whether the overflow menu is open
- `overflowLabel`: string (optional) — aria-label for the overflow trigger button (e.g., `"More actions"`)
- `onOverflowToggle`: (event: React.MouseEvent) => void (optional) — overflow trigger click handler
- `children`: ReactNode (optional) — the visible action buttons
- `overflow`: ReactNode (optional) — content for the overflow menu (typically a `Menu`)
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<ActionGroup
  label="Text formatting"
  overflowLabel="More actions"
  overflowOpen={menuOpen}
  onOverflowToggle={() => setMenuOpen(!menuOpen)}
  overflow={
    <Menu>
      <MenuItem>Underline</MenuItem>
      <MenuItem>Strikethrough</MenuItem>
    </Menu>
  }
>
  <button type="button">Bold</button>
  <button type="button">Italic</button>
</ActionGroup>
```

## ARIA

- `role="group"` on the root with `aria-label`
- Overflow trigger has `aria-haspopup="menu"`, `aria-expanded`, and `aria-label`
- Overflow menu uses the `hidden` attribute when closed

## References

- [Adobe Spectrum ActionGroup](https://spectrum.adobe.com/page/action-group/)
