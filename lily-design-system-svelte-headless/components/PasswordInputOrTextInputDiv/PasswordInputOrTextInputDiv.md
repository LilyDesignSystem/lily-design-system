# PasswordInputOrTextInputDiv

PasswordInputOrTextInputDiv is a headless component that wraps a native `<input type="password">` element with accessible labelling and an optional toggle button to show or hide the password text. The input automatically includes `autocomplete="current-password"` for proper browser password manager integration.

This component is useful for login forms, registration forms, account settings, or any interface requiring secure password entry. The show/hide toggle improves usability by letting users verify their input, while the `aria-pressed` attribute on the toggle button communicates the visibility state to assistive technologies.

## Implementation Notes

- Renders a wrapper `<div>` containing the password input and an optional toggle button
- The input type dynamically switches between `"password"` and `"text"` based on the `visible` state
- Uses `$state(false)` to track password visibility internally
- Uses `$bindable("")` for the `value` prop, enabling two-way binding
- The toggle button uses `aria-pressed` to indicate the current visibility state
- Includes `autocomplete="current-password"` on the input for browser password manager support
- Supports `required` and `disabled` boolean states on the input
- Spreads `restProps` onto the wrapper `<div>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the password input via `aria-label`
- `value`: string (default: `""`) -- current password value; bindable with `bind:value`
- `showToggle`: boolean (default: `true`) -- whether to render the show/hide toggle button
- `toggleLabel`: string (default: `"Show password"`) -- accessible label for the toggle button
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Usage

```svelte
<PasswordInputOrTextInputDiv label="Password" bind:value />
```

## Keyboard Interactions

- Enter/Space on the toggle button: Toggles password visibility between masked and plain text

## ARIA

- `aria-label={label}` -- provides an accessible name for the password input
- `aria-label={toggleLabel}` -- provides an accessible name for the toggle button
- `aria-pressed={visible}` -- indicates whether the password is currently visible (on the toggle button)

## References

- HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
