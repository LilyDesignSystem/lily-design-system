# Editable

## Metadata

- Component: editable
- PascalCase: Editable
- Description: an inline-editable text element that toggles between view and edit modes
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .editable
- Interactive: yes

## Key Behaviors

- The root is a `<div class="editable">`; display mode renders a native `<button type="button" class="editable-button">`, which is focusable and has Enter and Space of its own
- Edit mode renders an `<input type="text" class="editable-input">` bound to an internal draft value; focus moves to it, and back to the button on confirm or cancel
- Supports two-way binding for both `value` and `editing` props
- Uses reactive state for the internal draft value during editing
- Enter key in edit mode calls `confirm()` which copies draft to value
- Escape key in edit mode calls `cancel()` which restores draft from value
- A click on the button (and so its own Enter and Space) starts editing
- When `disabled` is true, the button is disabled
- Accepts `...restProps` for forwarding additional attributes to the root `<div>`

## ARIA

- `aria-label` -- the accessible name: in edit mode the `label`; in display mode `"value, label"` (the label alone when the value is empty), so the visible text is part of the name (WCAG 2.5.3 label in name)
- A native `<button>` in display mode: no `role` to add
- `disabled` on the button when `disabled` is true

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
- [ ] Has aria-label attribute (display mode: "value, label")
- [ ] Holds a native <button> in display mode
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .editable in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/editable.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
