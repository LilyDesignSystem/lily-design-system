# Input

An input provides a headless text input field with accessible labeling and two-way value binding. It serves as the foundational form input component for text entry, supporting various HTML input types such as text, email, password, number, search, and more.

The component supports bindable value state, required and disabled attributes, and spreads additional props for full consumer control over the native `<input>` element.

## Implementation Notes

- Renders a single `<input>` element with the specified `type` attribute.
- Uses `aria-label` for accessible naming since there is no built-in visible `<label>` element.
- The `value` prop uses two-way binding of the input text.
- The `type` prop defaults to `"text"` but accepts any valid HTML input type string.
- Supports native `required` and `disabled` attributes.
- Spreads `restProps` onto the `<input>` for consumer customization (e.g., `placeholder`, `maxlength`, `pattern`).

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `value`: string (default: `""`) -- bindable current input value.
- `type`: string (default: `"text"`) -- HTML input type attribute (e.g., `"text"`, `"email"`, `"password"`, `"number"`).
- `required`: boolean (default: `false`) -- whether the input is required for form submission.
- `disabled`: boolean (default: `false`) -- whether the input is disabled.
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element.

## Usage

Generic text input for a custom field type:

```html
<Input label="Reference code" value={refCode} type="text" required placeholder="e.g. ABC-1234" />
```

Numeric input for a quantity field:

```html
<Input label="Quantity" value={qty} type="number" min="1" max="100" required />
```

Disabled input during form submission:

```html
<Input label="Account ID" value={accountId} type="text" disabled={isSubmitting} />
```

## Keyboard Interactions

None -- this component uses the native `<input>` element, which provides built-in keyboard support (Tab to focus, standard text editing keys).

## ARIA

- `aria-label` -- provides an accessible name for the input when no visible label is present.

## When to Use

- Use as a generic HTML input when a more specific input component (TextInput, EmailInput, etc.) is not available.
- Use as the foundational text entry component for forms, supporting any HTML input type.
- Use when you need a simple, single-line input with accessible labeling and two-way value binding.

## When Not to Use

- Do not use when a specialised input exists -- prefer TextInput, EmailInput, TelInput, NumberInput, DateInput, or SearchInput instead.
- Do not use for multi-line text entry -- use Textarea instead.
- Do not use for file selection -- use FileInput instead.

## Headless

This headless component provides a native `<input>` element with `aria-label`, two-way value binding, and support for `required` and `disabled` attributes. The consumer provides all visual styling including borders, padding, focus states, and placeholder text appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `input`
- Verify aria-label` -- provides an accessible name for the input when no visible label is present.
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure input fields have visible focus indicators and sufficient padding. Use consistent sizing across related form fields.
- **Developers**: Prefer specialized input components (EmailInput, TelInput, etc.) when available, as they provide type-specific defaults. Use the `type` prop to leverage browser-native validation and mobile keyboard optimization.

## References

- MDN Input element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
- WAI-ARIA Forms: https://www.w3.org/WAI/tutorials/forms/
