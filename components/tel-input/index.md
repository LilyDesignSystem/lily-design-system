# Tel Input

A telephone input component that provides a telephone number input field using the native HTML `<input type="tel">` element. It includes accessible labeling via `aria-label` and browser autofill support via `autocomplete="tel"`, making it suitable for contact forms, registration flows, and profile editors.

The component supports two-way data binding through a bindable `value` prop, allowing parent components to read and write the telephone number. It also supports `required` and `disabled` states for form validation and conditional interactivity.

## Implementation Notes

- Renders as a single `<input type="tel">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can wrap with their own `<label>`)
- `autocomplete="tel"` enables browser and password manager autofill for phone numbers
- Bindable `value` prop uses two-way binding for two-way data binding
- Supports `required` and `disabled` HTML attributes natively
- Spreads `...restProps` onto the `<input>` for additional attributes like `placeholder`, `pattern`, `maxlength`, etc.

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: string (default: `""`) -- bindable telephone number value
- `required`: boolean (default: `false`) -- whether the field is required for form submission
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any -- additional HTML attributes spread onto the `<input>` element

## Usage

Contact form phone number:

```html
<TelInput label="Phone number" value={phone} required placeholder="+1-555-0100" />
```

Emergency contact with pattern validation:

```html
<TelInput label="Emergency contact number" value={emergencyPhone} required pattern="[+][0-9\-]+" />
```

Optional mobile number:

```html
<TelInput label="Mobile number" value={mobile} />
```

## Keyboard Interactions

- Native `<input type="tel">` keyboard behavior applies (Tab to focus, type to enter digits)

## ARIA

- `aria-label` -- provides the accessible name for the input, set from the `label` prop
- `autocomplete="tel"` -- signals browsers to offer telephone number autofill

## When to Use

- Use for entering a telephone number with the correct mobile keyboard.
- Use with appropriate autocomplete attributes for faster form completion.
- Use in contact forms, registration flows, and profile editors.
- Use when browser autofill for phone numbers (`autocomplete="tel"`) is beneficial.

## When Not to Use

- Do not use for general numeric input -- use NumberInput instead.
- Do not use for displaying a phone number as a clickable link -- use TelLink instead.
- Do not use when you need formatted phone display without an input field.

## Headless

This headless component renders a native `<input type="tel">` with `aria-label`, `autocomplete="tel"`, and two-way value binding. It provides telephone input semantics with browser autofill support. The consumer provides all visual styling including borders, padding, placeholder text, and validation feedback.


## Styles

The consumer provides all CSS styling. The component renders with a `.tel-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `tel-input`
- Verify aria-label` -- provides the accessible name for the input, set from the `label` prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Show an example format as placeholder text (e.g., "+1-555-0100") to guide user input. Place the phone input near related contact fields.
- **Developers**: Use the `pattern` attribute via `restProps` for client-side validation of phone number formats. Pair TelInput with TelLink to create an input/display pair for phone numbers.

## Composition

TelInput and TelLink follow the Input/Link pattern. TelInput provides the editable telephone input for forms, while TelLink provides the read-only clickable `tel:` link for display. Use them together for edit and view modes of phone number data.

## References

- HTML tel input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel
