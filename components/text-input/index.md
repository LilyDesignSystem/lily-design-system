# Text Input

A text input provides a single-line text field for entering short text values such as names, titles, or other brief textual data. It wraps the native HTML `<input type="text">` element with accessible labelling and two-way data binding.

This component is suitable for any form field requiring free-text entry. It supports required and disabled states and uses `aria-label` to ensure screen readers announce the field purpose. The bindable `value` prop enables reactive two-way data flow with the parent component.

## Implementation Notes

- Renders a native `<input type="text">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports two-way binding for the `value` prop, enabling two-way `value` binding in the parent
- Supports two-way binding on the `value` prop
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `maxlength`, `pattern`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current text value, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```html
<Field label="What is your full name?">
  <TextInput label="Full name" autocomplete="name" />
</Field>

<Field label="Enter a full postcode in England">
  <Hint>For example, LS1 1AB</Hint>
  <TextInput label="Postcode" autocomplete="postal-code" />
</Field>

<Field label="What is your NHS number?">
  <Hint>This is a 10-digit number, like 485 777 3456</Hint>
  <TextInput label="NHS number" inputmode="numeric" />
</Field>
```

## Keyboard Interactions

None beyond native input behavior -- standard text editing keys (typing, backspace, selection, clipboard shortcuts) are handled by the browser.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## When to Use

- Use when users need to enter a short, single-line text response such as a name, postcode, or reference number
- Use with a visible Label positioned above the input -- never rely on placeholder text as a label
- Use with an appropriate input width that reflects the expected length of the answer
- Use with `inputmode="numeric"` for fields that expect numbers but are not quantity inputs

## When Not to Use

- Do not use for multi-line responses -- use Textarea instead
- Do not use for searching with results -- use SearchInput or TextInputWithSearch
- Do not use for structured date entry -- use DateInput with separate day/month/year fields
- Do not use for passwords -- use PasswordInput which includes show/hide functionality
- Do not use for email, URL, or telephone -- use EmailInput, UrlInput, or TelInput for correct keyboard and validation

## Headless

This headless component renders a native `<input type="text">` with `aria-label` and two-way value binding. It provides standard text input semantics, required/disabled states, and rest prop forwarding for attributes like `placeholder`, `maxlength`, and `pattern`. The consumer provides all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.text-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `text-input`
- Verify aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included
- Verify pass-through attributes are applied

## Advice

- **Designers**: Size the input width to match the expected content length (e.g., wider for full names, narrower for short codes). Use placeholder text sparingly and never as a substitute for labels.
- **Developers**: Use `restProps` to pass `placeholder`, `maxlength`, `pattern`, and other native attributes. Wrap the input with a Field and Label component for a complete accessible form field.

## References

- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
