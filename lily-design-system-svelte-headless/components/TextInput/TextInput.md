# TextInput

A text input provides a single-line text field for entering short text values such as names, titles, or other brief textual data. It wraps the native HTML `<input type="text">` element with accessible labelling and two-way data binding.

This component is suitable for any form field requiring free-text entry. It supports required and disabled states and uses `aria-label` to ensure screen readers announce the field purpose. The bindable `value` prop enables reactive two-way data flow with the parent component.

## Implementation Notes

- Renders a native `<input type="text">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Uses `$bindable()` for the `value` prop, enabling `bind:value` in the parent
- Uses Svelte `bind:value` internally for reactive two-way binding
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `maxlength`, `pattern`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current text value, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```svelte
<TextInput label="Full name" bind:value />
```

```svelte
<TextInput label="Email" bind:value={email} required={true} />
```

```svelte
<TextInput label="Notes" bind:value={notes} disabled={true} />
```

## Keyboard Interactions

None beyond native input behavior -- standard text editing keys (typing, backspace, selection, clipboard-copy-button shortcuts) are handled by the browser.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## References

- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
