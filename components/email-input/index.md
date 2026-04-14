# Email Input

An email input wraps a native `<input type="email">` with accessible labeling. A simpler variant of EmailAddressInput for basic email collection, it omits placeholder and autocomplete support in favor of a minimal API. Use EmailInput when you need a straightforward email field with required and disabled state support.

## Implementation Notes

- Renders a native `<input type="email">` element for browser-native email validation
- Supports two-way binding of the email string
- Provides `aria-label` for screen reader accessibility
- Supports `required` and `disabled` for standard form behavior
- Spreads `restProps` for consumer customization
- Unlike EmailAddressInput, does not set `autocomplete` or support `placeholder`

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`) -- current email value, two-way bindable via `value`
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Usage

Contact form email field:

```html
<EmailInput label="Email address" value={email} required />
```

Registration form with disabled state during submission:

```html
<EmailInput label="Work email" value={workEmail} required disabled={isSubmitting} />
```

## Keyboard Interactions

None -- keyboard behavior is provided by the browser-native email input.

## ARIA

- `aria-label="..."` -- provides an accessible name for the email input since it has no visible `<label>` element

## When to Use

- Use for entering an email address with the correct mobile keyboard and browser validation.
- Use with `autocomplete="email"` for faster form completion.
- Use when browser-native email validation is sufficient for your needs.
- Use in contact forms, registration flows, and profile editors.

## When Not to Use

- Do not use for general text input -- use TextInput instead.
- Do not use for displaying an email as a clickable link -- use EmailLink instead.
- Do not use when you need placeholder text or autocomplete support; consider a more feature-rich email input variant.

## Headless

This headless component provides a native `<input type="email">` with accessible labeling via `aria-label`, two-way value binding, and support for `required` and `disabled` states. Browser-native email validation is included automatically. The consumer provides all visual styling, layout, and any custom validation messages.


## Styles

The consumer provides all CSS styling. The component renders with a `.email-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `email-input`
- Verify aria-label="..."` -- provides an accessible name for the email input since it has no visible `<label>` element
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place the email input near related contact fields. Provide clear error styling when validation fails so users know the expected format.
- **Developers**: Rely on the browser's built-in email validation for basic format checking. Add server-side validation for stricter requirements. Pair with a Field component for label and error message display.

## References

- MDN `<input type="email">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
