# Australia Individual Healthcare Identifier Input

AustraliaIndividualHealthcareIdentifierInput is a headless input for entering Australia's Individual Healthcare Identifier (IHI), Australia's healthcare identifier. It renders as `<input type="text">` with pattern validation, numeric/letter keyboard hints, and `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to AustraliaIndividualHealthcareIdentifierView.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation
- Format: 16 digits assigned by the Healthcare Identifiers Service
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to AustraliaIndividualHealthcareIdentifierView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="Individual Healthcare Identifier" required>
  <AustraliaIndividualHealthcareIdentifierInput label="Individual Healthcare Identifier" value={value} required />
  <Hint>16 digits assigned by the Healthcare Identifiers Service</Hint>
  <ErrorMessage>Please enter a valid Individual Healthcare Identifier</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting Australia's Individual Healthcare Identifier (IHI).
- Use with pattern validation matching the documented format.
- Use in administrative or healthcare workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `australia-individual-healthcare-identifier-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.australia-individual-healthcare-identifier-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify pattern attribute matches the documented format
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

The Individual Healthcare Identifier (IHI) is Australia's healthcare identifier. Format: 16 digits assigned by the Healthcare Identifiers Service.

## Related components

- `australia-individual-healthcare-identifier-view` — a read-only display of Australia's Individual Healthcare Identifier (IHI)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: https://en.wikipedia.org/wiki/My_Health_Record
