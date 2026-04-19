# Editable

## Metadata

- Component: editable
- PascalCase: Editable
- Description: an inline-editable text element that toggles between view and edit modes
- HTML tag: <div>
- CSS class: .editable
- Interactive: yes

## Key Behaviors

- Display mode renders a `<span>` with `role="button"` and `tabindex="0"` for keyboard activation
- Edit mode renders an `<input type="text">` bound to an internal draft value
- Supports two-way binding for both `value` and `editing` props
- Uses reactive state for the internal draft value during editing
- Enter key in edit mode calls `confirm()` which copies draft to value
- Escape key in edit mode calls `cancel()` which restores draft from value
- Display mode responds to click, Enter, and Space for activation
- When `disabled` is true, the span gets `tabindex="-1"` and `aria-disabled`
- Accepts `...restProps` for forwarding additional attributes

## ARIA

- `aria-label={label}` -- provides an accessible name in both display and edit modes
- `role="button"` -- on the display span, indicates it is an activatable element
- `aria-disabled={disabled}` -- on the display span when disabled, communicates the disabled state
- `tabindex="0"` / `tabindex="-1"` -- controls focusability based on disabled state

## Keyboard

- Enter: Activate edit mode
- Space: Activate edit mode
- Enter: Confirm the edit and return to display mode
- Escape: Cancel the edit and return to display mode

## Props

- `value`: string (default: "") -- current text value; bindable
- `label`: string (required) -- accessible name for the editable control, applied via `aria-label`
- `editing`: boolean (default: false) -- whether the component is in edit mode; bindable
- `disabled`: boolean (default: false) -- whether editing is disabled

## Acceptance Criteria

- [ ] Renders <div> element with class="editable"
- [ ] Has aria-label attribute
- [ ] Has role="button"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .editable in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/editable.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
