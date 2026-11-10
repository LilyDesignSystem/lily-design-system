# Editable

An editable component allows inline text editing. It displays a value as plain text that can be clicked or activated via keyboard to enter edit mode, where it becomes an input field. Pressing Enter confirms the edit, and pressing Escape cancels it, reverting to the original value.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

This headless component is a `<div class="editable">` that holds a native `<button type="button" class="editable-button">` in display mode and an `<input type="text" class="editable-input">` in edit mode. It maintains a draft value during editing so that cancellation restores the original text. Both the `value` and `editing` state support two-way binding.

## Implementation Notes

- The root is a `<div class="editable">`; display mode renders a native `<button type="button" class="editable-button">`, which is focusable and has Enter and Space of its own
- Edit mode renders an `<input type="text" class="editable-input">` bound to an internal draft value; focus moves to it, and back to the button on confirm or cancel
- Supports two-way binding for both `value` and `editing` props
- Uses reactive state for the internal draft value during editing
- Enter key in edit mode calls `confirm()` which copies draft to value
- Escape key in edit mode calls `cancel()` which restores draft from value
- A click on the button (and so its own Enter and Space) starts editing
- When `disabled` is true, the button is disabled
- Accepts `...restProps` for forwarding additional attributes to the root `<div>`

## Props

- `value`: string (default: "") -- current text value; bindable
- `label`: string (required) -- accessible name for the editable control, applied via `aria-label`
- `editing`: boolean (default: false) -- whether the component is in edit mode; bindable
- `disabled`: boolean (default: false) -- whether editing is disabled

## Usage

Inline-editable project name:

```html
<Editable
  label="Project name"
  value="{projectName}"
/>
```

Editable status text with controlled edit state:

```html
<Editable
  label="Status"
  value="{statusText}"
  editing="{isEditing}"
/>
```

Disabled editable field for read-only users:

```html
<Editable
  label="Owner"
  value="{ownerName}"
  disabled="{!canEdit}"
/>
```

## Keyboard Interactions

In display mode:

- Enter: Activate edit mode
- Space: Activate edit mode

In edit mode:

- Enter: Confirm the edit and return to display mode
- Escape: Cancel the edit and return to display mode

## ARIA

- `aria-label` -- the accessible name: in edit mode the `label`; in display mode `"value, label"` (the label alone when the value is empty), so the visible text is part of the name (WCAG 2.5.3 label in name)
- A native `<button>` in display mode: no `role` to add
- `disabled` on the button when `disabled` is true

## When to Use

- Use for inline text that toggles between view and edit modes on click.
- Use for quick edits like renaming items, updating status text, or correcting short fields.
- Use when navigating to a separate edit page would be disruptive to the workflow.
- Use in data tables or lists where individual values need in-place editing.

## When Not to Use

- Do not use for complex forms with multiple fields -- use Form with Field components instead.
- Do not use for multi-line editing -- use TextAreaInput instead.
- Do not use when the field should always be in edit mode -- use TextInput instead.
- Do not use when form submission semantics are needed -- use EditableForm instead.

## Headless

This headless component provides a display mode (a native `<button>` in a `<div>` root) and edit mode (`<input type="text">`) with full keyboard support (Enter to confirm, Escape to cancel), draft value management, two-way binding on both `value` and `editing`, and disabled state handling. The consumer provides all visual styling for both display and edit modes.

## Styles

The consumer provides all CSS styling. The component renders with a `.editable` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `editable`
- Verify the display-mode button's `aria-label` is `"value, label"` and the edit-mode input's is the `label`
- Verify the root is a `<div>` holding a native `<button>`, and that focus follows the swap
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the display text visually distinct from static text (e.g., with an underline or hover effect) so users know it is editable. Provide clear visual feedback when entering and exiting edit mode.
- **Developers**: Use the `editing` bind to coordinate with other components or show save/cancel buttons. The component manages a draft value internally, so cancellation safely reverts changes.

## Related components

- `editable-form` — a form wrapper for inline editing of content
- `text-input` — a single-line text input field <input type="text">

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

---

Lily™ and Lily Design System™ are trademarks.
