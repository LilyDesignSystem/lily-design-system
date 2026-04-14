# Password Input Or Text Input Div

PasswordInputOrTextInputDiv is a headless component that wraps a native `<input type="password">` and `<input type="text">` element with accessible labelling and an optional toggle button to show or hide the password text. The input automatically includes `autocomplete="current-password"` for proper browser password manager integration.

This component is useful for login forms, registration forms, account settings, or any interface requiring secure password entry. The show/hide toggle improves usability by letting users verify their input, while the `aria-pressed` attribute on the toggle button communicates the visibility state to assistive technologies.

## Implementation Notes

- Renders a wrapper `<div>` containing the password input and an optional toggle button
- The input type dynamically switches between `"password"` and `"text"` based on the `visible` state
- Uses reactive state to track password visibility internally
- Supports two-way binding on the `value` prop
- The toggle button uses `aria-pressed` to indicate the current visibility state
- Includes `autocomplete="current-password"` on the input for browser password manager support
- Supports `required` and `disabled` boolean states on the input
- Spreads `restProps` onto the wrapper `<div>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the password input via `aria-label`
- `value`: string (default: `""`) -- current password value; bindable with two-way `value` binding
- `showToggle`: boolean (default: `true`) -- whether to render the show/hide toggle button
- `toggleLabel`: string (default: `"Show password"`) -- accessible label for the toggle button
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`

## Usage

```html
<Field label="Password">
  <PasswordInputOrTextInputDiv label="Password" value={value} />
</Field>

<Field label="Create a password">
  <Hint>Must be at least 12 characters</Hint>
  <PasswordInputOrTextInputDiv
    label="Create a password"
    toggleLabel="Show password"
    value={value}
  />
</Field>

<Field label="Confirm password">
  <PasswordInputOrTextInputDiv
    label="Confirm password"
    toggleLabel="Show password"
    value={confirmValue}
  />
</Field>
```

## Keyboard Interactions

- Enter/Space on the toggle button: Toggles password visibility between masked and plain text

## ARIA

- `aria-label={label}` -- provides an accessible name for the password input
- `aria-label={toggleLabel}` -- provides an accessible name for the toggle button
- `aria-pressed={visible}` -- indicates whether the password is currently visible (on the toggle button)

## When to Use

- Use when you need a password field with an explicit show/hide toggle button that switches the input type between password and text
- Use when the toggle behaviour needs to be visible as a button alongside the input
- Use for login forms, registration flows, and account settings where users benefit from verifying their password entry
- Use when you want the consumer to have full control over the toggle button styling and positioning

## When Not to Use

- Do not use when a standard PasswordInput with built-in show/hide is sufficient
- Do not use for non-password fields -- use TextInput for plain text or PinInputDiv for codes
- Do not use for MFA codes, one-time passwords, or PINs -- use PinInputDiv instead

## Headless

The PasswordInputOrTextInputDiv headless component provides a `<div>` wrapping a native `<input>` with dynamic type switching between `password` and `text`, `aria-label` for accessible naming, `aria-pressed` on the toggle button, and `autocomplete="current-password"`. The consumer provides all visual styling for the input, toggle button, and wrapper layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.password-input-or-text-input-div` class for targeting. Common styling includes positioning the toggle button within or beside the input field.

## Testing

- Verify the component renders a wrapper `<div>` containing an `<input>` element
- Verify the input `type` is `"password"` by default
- Verify `aria-label` is set from the `label` prop
- Verify the toggle button switches the input type between `"password"` and `"text"`
- Verify `aria-pressed` on the toggle button reflects the visibility state
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied to the wrapper `<div>`

## Advice

- **Designers**: Position the show/hide toggle button clearly within or beside the input field, using a recognizable eye icon with sufficient contrast.
- **Developers**: Set `autocomplete` to `"new-password"` for registration forms by overriding via `restProps` to help password managers distinguish between login and signup flows.

## References

- HTML password input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
