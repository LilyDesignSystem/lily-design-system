# Editable

An editable component allows inline text editing. It displays a value as plain text that can be clicked or activated via keyboard to enter edit mode, where it becomes an input field. Pressing Enter confirms the edit, and pressing Escape cancels it, reverting to the original value.

This headless component is a `<div class="editable">` that holds a native `<button type="button" class="editable-button">` in display mode and an `<input type="text" class="editable-input">` in edit mode. It maintains a draft value during editing so that cancellation restores the original text. Both the `value` and `editing` state support two-way binding.

## Implementation Notes

- The root is a `<div class="editable">`; display mode renders a native `<button type="button" class="editable-button">`, which is focusable and has Enter and Space of its own
- Edit mode renders an `<input type="text" class="editable-input">` bound to an internal draft value; focus moves to it, and back to the button on confirm or cancel
- Uses `$bindable()` for both `value` and `editing` props
- Uses `$state()` for the internal draft value during editing
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

```svelte
<Editable
  label="Name"
  bind:value
/>
```

```svelte
<Editable
  label="Title"
  bind:value
  bind:editing
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

- `aria-label={label}` -- provides an accessible name in both display and edit modes
- A native `<button>` in display mode: no `role` to add
- `disabled` on the button when `disabled` is true

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
