# SegmentGroupItem

## Metadata

- Component: segment-group-item
- PascalCase: SegmentGroupItem
- Description: one selectable segment in a segment group
- HTML tag: <div>
- CSS class: .segment-group-item
- Interactive: no

## Composition

- Pattern: Group/GroupItem
- Parent: segment-group

## Key Behaviors

- Renders a `<button>` element with `role="radio"` for ARIA semantics
- `aria-checked` reflects the `checked` prop to indicate selection state
- Uses roving tabindex: `tabindex="0"` when checked, `tabindex="-1"` otherwise
- `data-value` attribute exposes the segment value for CSS styling or JS queries
- Supports `disabled` prop to prevent interaction
- Spreads `restProps` onto the button for consumer customization

## ARIA

- `role="radio"` -- identifies this button as a radio-like option within a radiogroup
- `aria-checked` -- indicates whether this segment is selected (`true`) or not (`false`)
- Roving tabindex -- only the checked item has `tabindex="0"`, others have `tabindex="-1"`

## Keyboard

- Tab: Focus moves to the checked segment (or first segment if none checked)
- Arrow Left / Arrow Right: Consumer should implement arrow key navigation on the parent SegmentGroup
- Space / Enter: Activates the focused segment (native button behavior)

## Props

- `checked`: boolean (default `false`) -- whether this segment is currently selected
- `value`: string (default `""`) -- value associated with this segment, exposed as `data-value`
- `disabled`: boolean (default `false`) -- whether the segment is disabled
- `children`: slot (required) -- label content to render inside the button
- `...restProps`: unknown -- additional attributes spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="segment-group-item"
- [ ] Has role="radio"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .segment-group-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/segment-group-item.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
