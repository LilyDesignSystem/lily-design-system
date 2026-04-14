# Postal Code Input

A postal code input provides a text field specifically designed for entering postal or ZIP codes. It includes `autocomplete="postal-code"` to enable browsers to auto-fill the value from stored address data, streamlining address form completion.

This component is useful in address forms, checkout flows, shipping calculators, and any interface that requires postal code entry. It pairs with PostalCodeView for displaying the entered value in read-only contexts. The bindable value prop supports two-way data binding with the parent component.

## Implementation Notes

- Renders a native `<input type="text">` element (not `type="number"`, since postal codes may contain letters or dashes)
- Uses `autocomplete="postal-code"` to hint browser autofill for postal/ZIP code fields
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports two-way binding for the `value` prop, enabling two-way `value` binding in the parent
- Supports two-way binding on the `value` prop
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `placeholder`, `pattern`, `maxlength`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: string (default: `""`, bindable) -- current postal code value, supports two-way binding
- `required`: boolean (default: `false`) -- whether the field is required
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

Basic postal code input:

```html
<PostalCodeInput label="Postal code" value={postalCode} />
```

Required ZIP code input for a US address form:

```html
<PostalCodeInput label="ZIP code" value={zipCode} required placeholder="90210" />
```

UK postcode input with placeholder format hint:

```html
<PostalCodeInput label="Postcode" value={postcode} placeholder="SW1A 1AA" />
```

Postal code input within an address form:

```html
<Form label="Shipping address" onsubmit={handleSubmit}>
  <Field label="Street address" required>
    <TextInput label="Street address" value={street} required />
  </Field>
  <Field label="City" required>
    <TextInput label="City" value={city} required />
  </Field>
  <Field label="Postcode" required>
    <PostalCodeInput label="Postcode" value={postcode} required placeholder="SW1A 1AA" />
  </Field>
  <Button type="submit">Save address</Button>
</Form>
```

## Keyboard Interactions

None beyond native input behavior -- standard text editing keys (typing, backspace, selection, clipboard shortcuts) are handled by the browser.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included

## When to Use

- Use in address forms, checkout flows, and shipping calculators where users need to enter a postal or ZIP code.
- Use when you want browser autofill support via `autocomplete="postal-code"`.
- Use in registration forms or location-based search interfaces that require postal code entry.
- Use for delivery address entry where postal code validation is important.

## When Not to Use

- Do not use for displaying a postal code in read-only format -- use PostalCodeView instead.
- Do not use for general text or numeric input -- use TextInput or NumberInput instead.
- Do not use for full address entry -- combine with other address fields in a form.

## Headless

The PostalCodeInput headless component provides a native `<input type="text">` with `autocomplete="postal-code"`, `aria-label` for accessible naming, and two-way value binding. The consumer provides all visual styling, validation patterns, placeholder text, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.postal-code-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `postal-code-input`
- Verify aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included
- Verify pass-through attributes are applied

## Advice

- **Designers**: Size the input field to match the expected postal code format for your target locale, and include a placeholder showing the expected format (e.g., "SW1A 1AA" or "90210").
- **Developers**: Use the `pattern` attribute via `restProps` to validate locale-specific postal code formats, and pair with PostalCodeView for read-only display contexts.

## Composition

PostalCodeInput is the editable counterpart of PostalCodeView. Use PostalCodeInput for data entry and PostalCodeView for read-only display of the same postal code value.

## References

- HTML autocomplete attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
- MDN input type="text": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
