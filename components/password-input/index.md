# Password Input

PasswordInput is a headless component that renders a native `<input type="password">` element with accessible labelling. The input obscures the entered text with dots or asterisks, providing secure password entry.

Use this component in login forms, registration forms, account settings, or any interface requiring secure password entry. For a more featured variant with a show/hide toggle, see PasswordInputOrTextInputDiv.

## Implementation Notes

- Renders a native `<input type="password">` element for secure text entry
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial empty string state
- Includes `autocomplete="current-password"` for browser password manager integration
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- current password value; bindable with two-way binding
- `autocomplete`: string (default: `"current-password"`) -- autocomplete hint for password managers
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<Field label="Create a password">
  <Hint>Must be at least 12 characters</Hint>
  <PasswordInput
    label="Create a password"
    autocomplete="new-password"
    spellcheck="false"
  />
</Field>

<Field label="Password">
  <PasswordInput
    label="Password"
    autocomplete="current-password"
    spellcheck="false"
  />
</Field>
```

## Keyboard Interactions

Standard text input keyboard interactions provided natively by `<input type="password">`.

## ARIA

- `aria-label={label}` -- provides an accessible name for the password input

## When to Use

- Use whenever you need users to create a new password or enter an existing password
- Use with `autocomplete="new-password"` for password creation and `autocomplete="current-password"` for sign-in
- Use with the show/hide toggle so users can verify their password before submitting
- Use with `spellcheck="false"` and `autocapitalize="off"` to prevent spell-jacking and unwanted capitalisation

## When Not to Use

- Do not use for MFA codes, one-time passwords, or PINs -- use PinInputDiv or TextInput instead
- Do not use for security question answers or other sensitive non-password fields -- use TextInput
- Do not use when you need a combined show/hide toggle with a confirmation field -- use PasswordInputOrTextInputDiv

## Headless

This headless component renders a native `<input type="password">` element with `aria-label`, two-way bindable value, and `autocomplete` support. The consumer provides all visual styling including sizing, borders, and focus states.

## Styles

The consumer provides all CSS styling. The component renders with a `.password-input` class for targeting. Common styling includes matching the visual style of other text inputs in the form.

## Testing

- Verify the component renders an `<input>` element with `type="password"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete` defaults to `"current-password"`
- Verify `disabled` and `required` attributes propagate correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the password input matches the visual style of other form inputs. Consider using a lock icon or label to clearly indicate the field requires a password.
- **Developers**: Set `autocomplete` to `"new-password"` for registration forms to help password managers distinguish between login and signup flows.

## References

- MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
- HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
