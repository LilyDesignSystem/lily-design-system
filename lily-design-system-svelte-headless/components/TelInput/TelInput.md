# TelInput

A telephone input component that provides a telephone number input field using the native HTML `<input type="tel">` element. It includes accessible labeling via `aria-label` and browser autofill support via `autocomplete="tel"`, making it suitable for contact forms, registration flows, and profile editors.

The component supports two-way data binding through a bindable `value` prop, allowing parent components to read and write the telephone number. It also supports `required` and `disabled` states for form validation and conditional interactivity.

## Implementation Notes

- Renders as a single `<input type="tel">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can wrap with their own `<label>`)
- `autocomplete="tel"` enables browser and password manager autofill for phone numbers
- Bindable `value` prop uses Svelte 5 `$bindable()` for two-way data binding
- Supports `required` and `disabled` HTML attributes natively
- Spreads `...restProps` onto the `<input>` for additional attributes like `placeholder`, `pattern`, `maxlength`, etc.

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- bindable telephone number value
- `required`: boolean (default: `false`) -- whether the field is required for form submission
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any -- additional HTML attributes spread onto the `<input>` element

## Usage

```svelte
<TelInput label="Phone number" bind:value />
```

```svelte
<TelInput label="Mobile" bind:value required />
```

## Keyboard Interactions

- Native `<input type="tel">` keyboard behavior applies (Tab to focus, type to enter digits)

## ARIA

- `aria-label` -- provides the accessible name for the input, set from the `label` prop
- `autocomplete="tel"` -- signals browsers to offer telephone number autofill

## References

- HTML tel input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel
