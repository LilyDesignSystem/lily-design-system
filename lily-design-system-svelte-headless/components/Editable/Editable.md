# Editable

An editable component allows inline text editing. It displays a value as plain text that can be clicked or activated via keyboard to enter edit mode, where it becomes an input field. Pressing Enter confirms the edit, and pressing Escape cancels it, reverting to the original value.

This headless component toggles between a display state (`<span role="button">`) and an edit state (`<input type="text">`). It maintains a draft value during editing so that cancellation restores the original text. Both the `value` and `editing` state support two-way binding.

## Implementation Notes

- Display mode renders a `<span>` with `role="button"` and `tabindex="0"` for keyboard activation
- Edit mode renders an `<input type="text">` bound to an internal draft value
- Uses `$bindable()` for both `value` and `editing` props
- Uses `$state()` for the internal draft value during editing
- Enter key in edit mode calls `confirm()` which copies draft to value
- Escape key in edit mode calls `cancel()` which restores draft from value
- Display mode responds to click, Enter, and Space for activation
- When `disabled` is true, the span gets `tabindex="-1"` and `aria-disabled`
- Accepts `...restProps` for forwarding additional attributes

## Props

- `value`: string (default: "") -- current text value; bindable
- `label`: string (required) -- accessible name for the editable control, applied via `aria-label`
- `editing`: boolean (default: false) -- whether the component is in edit mode; bindable
- `disabled`: boolean (default: false) -- whether editing is disabled

## Usage

```svelte
<Editable label="Name" bind:value />
```

```svelte
<Editable label="Title" bind:value bind:editing />
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
- `role="button"` -- on the display span, indicates it is an activatable element
- `aria-disabled={disabled}` -- on the display span when disabled, communicates the disabled state
- `tabindex="0"` / `tabindex="-1"` -- controls focusability based on disabled state

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
