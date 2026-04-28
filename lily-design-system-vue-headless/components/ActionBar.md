# ActionBar

A contextual action bar that appears when items are selected, showing the selection count and bulk action buttons.

## Implementation Notes

- Headless: no CSS
- `role="toolbar"` with required `aria-label`
- The clear button renders only when `clearSelectionLabel` is provided
- `data-selected-count` exposes the count for consumer styling

## Props

- `label`: string (**required**) — aria-label for the toolbar
- `selectedCount`: number (**required**) — count of currently selected items
- `selectedCountLabel`: string (**required**) — pre-formatted display of the count
- `clearSelectionLabel`: string (optional) — accessible label for the clear-selection button
- default slot — typically `ActionBarButton` children

## Events

- `clearSelection(event: MouseEvent)`

## Usage

```vue
<ActionBar
    label="Selection"
    :selected-count="3"
    selected-count-label="3 selected"
    clear-selection-label="Clear selection"
    @clear-selection="onClear"
>
    <ActionBarButton label="Delete" @click="onDelete">Delete</ActionBarButton>
    <ActionBarButton label="Archive" @click="onArchive">Archive</ActionBarButton>
</ActionBar>
```

## ARIA

- `role="toolbar"`
- `aria-label` is required
- The clear button has `aria-label` set from `clearSelectionLabel`

## When to Use

- For bulk actions on a list/grid selection
- When the available actions depend on having one or more items selected

## When Not to Use

- For per-row actions — use a row-level action menu instead

## Headless

Renders semantic HTML and ARIA attributes only. Consumers supply CSS to position the bar (e.g., sticky bottom or floating).

## Testing

- Verify the root `action-bar` class and `role="toolbar"`
- Verify the count label is rendered
- Verify the clear button only appears when `clearSelectionLabel` is supplied
- Verify the `clearSelection` event fires on clear-button click

## References

- [Adobe Spectrum — Action Bar](https://spectrum.adobe.com/page/action-bar/)
- [WAI-ARIA Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
