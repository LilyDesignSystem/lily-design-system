# MenuGroup

A labeled section of menu items within a menu. Inspired by Adobe Spectrum.

## Implementation Notes

- Renders a `<div>` with `role="group"` and `aria-label`
- Renders a visible heading element with `aria-hidden="true"` (since the `aria-label` conveys the section name to assistive technology)
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `label`: string (**required**) — section heading text (also used as `aria-label`)
- `children`: ReactNode (optional) — the menu items
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<Menu>
  <MenuGroup label="File actions">
    <MenuItem>New</MenuItem>
    <MenuItem>Open</MenuItem>
  </MenuGroup>
  <MenuGroup label="Edit actions">
    <MenuItem>Cut</MenuItem>
    <MenuItem>Copy</MenuItem>
  </MenuGroup>
</Menu>
```

## ARIA

- `role="group"` on the root with `aria-label`
- The visible heading is `aria-hidden` to avoid double-announcement

## References

- [Adobe Spectrum Menu](https://spectrum.adobe.com/page/menu/)
