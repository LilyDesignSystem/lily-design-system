# SegmentGroupItem

SegmentGroupItem is a single segment option within a SegmentGroup. It renders as a `<button>` with `role="radio"` and `aria-checked`, following the WAI-ARIA radio group pattern. Each item represents one mutually exclusive option in the segmented control.

Use SegmentGroupItem inside a SegmentGroup to build custom segmented controls such as view mode toggles (grid/list), filter selections, or display density controls.

## Implementation Notes

- Renders a `<button>` element with `role="radio"` for ARIA semantics
- `aria-checked` reflects the `checked` prop to indicate selection state
- Uses roving tabindex: `tabindex="0"` when checked, `tabindex="-1"` otherwise
- `data-value` attribute exposes the segment value for CSS styling or JS queries
- Supports `disabled` prop to prevent interaction
- Spreads `restProps` onto the button for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing

## Props

- `checked`: boolean (default `false`) -- whether this segment is currently selected
- `value`: string (default `""`) -- value associated with this segment, exposed as `data-value`
- `disabled`: boolean (default `false`) -- whether the segment is disabled
- `children`: Snippet (required) -- label content to render inside the button
- `...restProps`: unknown -- additional attributes spread onto the `<button>` element

## Usage

```svelte
<SegmentGroup label="View">
  <SegmentGroupItem checked={mode === 'grid'} value="grid" onclick={() => mode = 'grid'}>
    Grid
  </SegmentGroupItem>
  <SegmentGroupItem checked={mode === 'list'} value="list" onclick={() => mode = 'list'}>
    List
  </SegmentGroupItem>
</SegmentGroup>
```

## Keyboard Interactions

- Tab: Focus moves to the checked segment (or first segment if none checked)
- Arrow Left / Arrow Right: Consumer should implement arrow key navigation on the parent SegmentGroup
- Space / Enter: Activates the focused segment (native button behavior)

## ARIA

- `role="radio"` -- identifies this button as a radio-like option within a radiogroup
- `aria-checked` -- indicates whether this segment is selected (`true`) or not (`false`)
- Roving tabindex -- only the checked item has `tabindex="0"`, others have `tabindex="-1"`

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
