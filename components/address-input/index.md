# AddressInput

A labelled group for capturing a postal address: a `<div role="group">` named by `label`, holding the consumer's own fields, each with its `autocomplete` token so browsers, password managers and platform autofill can fill them from the user's saved addresses.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

Address shapes are national: the order runs largest to smallest in Japan, China and Korea and smallest to largest in
most of Europe and the Americas; some countries have no postal code, others no street names. So the component decides
no fields: put one `<textarea autocomplete="street-address">` inside it, which suits every country, or the structured
fields the address's country uses, in that country's order. Postcode lookup and suggestion dropdowns are the consumer's;
for typeahead, compose with `Autosuggest` or `Combobox` inside the group.

It is the one `-input` component whose root is not an `<input>` (an exception to the suffix table): an address is
several values, and one `<input>` cannot hold a structured address.

## Implementation Notes

- Renders a `<div role="group">` named by `label` through `aria-label`
- The consumer supplies the fields as children, each with its own `<label>` and `autocomplete` token (`street-address`, `address-line1`, `address-level2`, `postal-code`, `country-name`, …)
- No value of its own: each field is a form control, so the form submits and resets them
- Spreads `restProps` onto the root `<div>`
- All text content (the group label, the field labels, error messages) comes from the consumer

## Props

| Prop           | Type              | Default | Description                                  |
| -------------- | ----------------- | ------- | -------------------------------------------- |
| `label`        | string (required) | —       | The group's accessible name, on `aria-label` |
| `children`     | slot (required)   | —       | The labelled address fields                  |
| `...restProps` | HTML attributes   | —       | Spread onto the root `<div>`                 |

## Usage

```html
<AddressInput label="Delivery address">
  <label for="street">Street</label>
  <input
    id="street"
    autocomplete="address-line1"
  />
  <label for="town">Town or city</label>
  <input
    id="town"
    autocomplete="address-level2"
  />
  <label for="postcode">Postal code</label>
  <input
    id="postcode"
    autocomplete="postal-code"
  />
</AddressInput>
```

## Keyboard Interactions

- None of its own: Tab moves through the consumer's fields, which keep native input behaviour

## ARIA

- `role="group"` and `aria-label` (from `label`) name the set of fields, announced as the user enters it
- Each field has its own visible `<label>`; the consumer sets `aria-invalid` and `aria-errormessage` on a field that fails validation

## When to Use

- Capturing a postal address as part of a contact or delivery form, in one field or several
- Building a postcode lookup widget where the consumer wires the lookup logic externally

## When Not to Use

- Use `PostalCodeInput` alone when only a postal code is needed
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

- [WAI-ARIA group role](https://www.w3.org/TR/wai-aria-1.2/#group)
- [MDN autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)

---

Lily™ and Lily Design System™ are trademarks.
