# PasswordInput

A password input is a UI/UX component that provides a text field for entering passwords using the native HTML `<input type="password">` element. The entered text is obscured by default, displaying dots or asterisks instead of the actual characters. The component includes `aria-label` for accessibility and `autocomplete` for browser password manager integration.

Unlike PasswordInputOrTextInputDiv, which includes a show/hide toggle button in a wrapper div, PasswordInput is a single `<input>` element — simpler and suitable when visibility toggling is not needed or is handled externally.

## Implementation Notes

- Renders a single `<input type="password">` element for password entry
- The `value` prop supports controlled component usage with `value + onChange`
- The `aria-label` prop provides an accessible name since there is no visible `<label>` element
- Default `autocomplete` is "current-password" for browser password manager support
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `placeholder`, `minLength`)
- No ARIA attributes needed beyond `aria-label` for the accessible name

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `value`: string (default: "") -- current password text, controlled with `value + onChange`
- `autocomplete`: string (default: "current-password") -- autocomplete hint for password managers
- `required`: boolean (default: false) -- whether the field must be filled before form submission
- `disabled`: boolean (default: false) -- whether the input is disabled
- `onChange`: function (optional) -- callback invoked with the new value string when the input changes
- `...restProps`: spread onto the `<input>` element

## Usage

```tsx
<PasswordInput
  label="Password"
  value={value}
  onChange={setValue}
/>
```

```tsx
<PasswordInput
  label="New password"
  value={value}
  onChange={setValue}
  autocomplete="new-password"
/>
```

```tsx
<PasswordInput
  label="Password"
  value={value}
  onChange={setValue}
  required
/>
```

## Keyboard Interactions

- Tab: moves focus to the input (standard behavior)
- Enter: submits the containing form (standard input behavior)

Note: keyboard interactions are provided natively by the `<input type="password">` element.

## ARIA

- `aria-label={label}` -- provides the accessible name for the password field since no visible label element is associated

## References

- MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
