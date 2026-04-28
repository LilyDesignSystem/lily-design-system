# ActionBar

A contextual action bar that appears when items are selected, showing the selection count and bulk action buttons. Inspired by Adobe Spectrum's ActionBar.

## Implementation Notes

- Renders a `<div>` with `role="toolbar"` and `aria-label`
- The `selectedCount` is exposed via `data-selected-count` for consumer styling
- The clear-selection button only renders when **both** `onClearSelection` and `clearSelectionLabel` are provided
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `label`: string (**required**) — aria-label for the toolbar
- `selectedCount`: number (**required**) — count of currently selected items
- `selectedCountLabel`: string (**required**) — pre-formatted display of the count (e.g., `"3 selected"`)
- `clearSelectionLabel`: string (optional) — accessible label for the clear-selection button
- `onClearSelection`: (event: React.MouseEvent) => void (optional) — clear-selection click handler
- `children`: ReactNode (optional) — action buttons inside the toolbar (typically `ActionBarButton`)
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<ActionBar
  label="Selection actions"
  selectedCount={selected.length}
  selectedCountLabel={`${selected.length} selected`}
  clearSelectionLabel="Clear selection"
  onClearSelection={() => setSelected([])}
>
  <ActionBarButton label="Delete" onClick={handleDelete}>Delete</ActionBarButton>
  <ActionBarButton label="Archive" onClick={handleArchive}>Archive</ActionBarButton>
</ActionBar>
```

## ARIA

- `role="toolbar"` on the root
- `aria-label` set from the `label` prop
- `data-selected-count` exposes the count to CSS

## References

- [Adobe Spectrum ActionBar](https://spectrum.adobe.com/page/action-bar/)
- [WAI-ARIA Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
