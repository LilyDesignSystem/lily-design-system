# AddressInput

An input for searching or manually entering an address.

## Implementation Notes

- Renders a single `<input type="text">` with `autocomplete="street-address"` so browsers and password managers can populate it from saved addresses
- The consumer is responsible for any postcode lookup, autocomplete dropdown, or fallback to a multi-field structured form
- Supports two-way binding on the `value` prop
- Accepts `required` and `disabled` HTML attributes
- Spreads `restProps` onto the root `<input>` for consumer customization
- All text content (label, placeholder, error messages) comes through props for internationalization

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `label` | string (required) | — | Accessible name set on `aria-label` |
| `value` | string | "" | Bindable address value |
| `required` | boolean | false | Whether the field is required |
| `disabled` | boolean | false | Whether the field is disabled |
| `autocomplete` | string | "street-address" | HTML autocomplete token; useful values include `street-address`, `address-line1`, `address-line2`, `postal-code` |
| `...restProps` | HTML attributes | — | Spread onto the root `<input>` element |

## Usage

```html
<AddressInput label="Postal address" value="" autocomplete="street-address" />
```

## Keyboard Interactions

- Native `<input>` keyboard behaviour applies (typing, selection, clipboard)
- Tab moves focus into and out of the input

## ARIA

- `aria-label` (set from `label`) provides the accessible name when no visible `<label>` element wraps the input
- `aria-required="true"` is implied when `required` is set
- `aria-invalid` and `aria-errormessage` should be set by the consumer when validation fails

## When to Use

- Capturing a single-line postal address as part of a contact or delivery form
- Building a postcode lookup widget where the consumer wires the lookup logic externally

## When Not to Use

- Use a structured set of inputs (street, city, region, postcode) when you need separate fields for validation or formatting
- Use `Combobox` or `Autosuggest` when you want a typeahead dropdown of results

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.address-input` as the root class. No default styles are included.

## Related components

- `text-input` — single-line text input without address-specific autocomplete
- `autosuggest` — text input with proposed matching options
- `postal-code-input` — postal/ZIP code input with format validation

## References

- [MDN input type=text](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)
- [MDN autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
