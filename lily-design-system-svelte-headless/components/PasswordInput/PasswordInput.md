# PasswordInput

A password input is a UI/UX component that provides a secure text field using the native HTML `<input type="password">` element. The browser automatically obscures the entered text with dots or asterisks, protecting sensitive data from onlookers. It supports accessible labeling and two-way data binding.

Password inputs are the standard mechanism for collecting passwords, PINs, and other sensitive text in web forms. The `autocomplete` attribute helps password managers and browsers auto-fill credentials, improving both security and usability.

## Implementation Notes

- Renders a native `<input type="password">` element for built-in text obscuring
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Uses `$bindable()` for the `value` prop, enabling `bind:value` in the parent
- Uses Svelte `bind:value` internally for reactive two-way binding
- Default `autocomplete="current-password"` supports password manager integration
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `maxlength`, `minlength`, `pattern`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current password value, supports two-way binding
- `autocomplete`: string (default: `"current-password"`) -- autocomplete hint for browsers and password managers
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```svelte
<PasswordInput label="Password" bind:value />
```

```svelte
<PasswordInput label="Password" bind:value={password} required />
```

```svelte
<PasswordInput label="New password" bind:value={newPassword} autocomplete="new-password" />
```

```svelte
<PasswordInput label="Password" bind:value={password} disabled />
```

## Keyboard Interactions

None beyond native input behavior -- standard text editing keys (typing, backspace, selection, clipboard shortcuts) are handled by the browser.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## References

- MDN input type="password": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password
