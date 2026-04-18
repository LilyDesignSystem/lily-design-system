# SegmentGroup

SegmentGroup is a headless container for segmented controls that uses the ARIA `radiogroup` role. It groups a set of mutually exclusive options, such as view mode toggles (grid/list), filter selections, or display density controls.

Use SegmentGroup when you need a set of visually distinct toggle buttons where only one option can be active at a time. Unlike RadioGroup which wraps native radio inputs in a fieldset, SegmentGroup uses a `<div>` with `role="radiogroup"` and expects children to be buttons with `role="radio"` and `aria-checked` attributes. This makes it suitable for custom segmented control UIs that go beyond standard radio button appearance.

## Implementation Notes

- Renders a `<div>` element with `role="radiogroup"` for ARIA semantics
- The `aria-label` attribute provides an accessible name for the group
- Consumer provides segment button children, each with `role="radio"` and `aria-checked`
- Consumer is responsible for managing selection state (toggling `aria-checked` on children)
- Spreads `restProps` onto the div for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing

## Props

- `label`: string (required) -- accessible label for the segment group, applied via `aria-label`
- `children`: Snippet (required) -- segment button elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```svelte
<SegmentGroup label="View">
  <button role="radio" aria-checked="true">Grid</button>
  <button role="radio" aria-checked="false">List</button>
</SegmentGroup>
```

## Keyboard Interactions

- Tab: Moves focus into the segment group
- Arrow Left / Arrow Right: Consumer should implement arrow key navigation between segments (following the radiogroup pattern)
- Space / Enter: Consumer should implement activation of the focused segment

## ARIA

- `role="radiogroup"` -- identifies the container as a group of mutually exclusive radio-like options
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce its purpose

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- WAI-ARIA Authoring Practices - Toolbar: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
