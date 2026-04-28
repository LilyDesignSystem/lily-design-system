# ActionBarButton

One action button inside an `ActionBar`. The `label` prop is **required** because the button content is often an icon or short glyph, so an accessible name must be provided via `aria-label`.

## Implementation Notes

- Renders a `<button>` with `aria-label`
- Defaults to `type="button"` to avoid accidental form submissions
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `label`: string (**required**) — aria-label for the button
- `type`: `"button" | "submit" | "reset"` (default: `"button"`)
- `disabled`: boolean (default: `false`)
- `onClick`: (event: React.MouseEvent) => void (optional)
- `children`: ReactNode (optional) — button content (icon and/or text)
- `...restProps`: any additional HTML attributes passed to the `<button>`

## Usage

```tsx
<ActionBarButton label="Delete" onClick={handleDelete}>
  <span aria-hidden="true">🗑</span>
  Delete
</ActionBarButton>
```

## Keyboard Interactions

- Tab: focus the button
- Enter / Space: activate the button

## ARIA

- `aria-label` from the `label` prop (required)
- Native `disabled` attribute prevents activation

## References

- [Adobe Spectrum ActionBar](https://spectrum.adobe.com/page/action-bar/)
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
