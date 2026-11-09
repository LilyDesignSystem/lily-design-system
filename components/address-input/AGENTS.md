# AddressInput

## Metadata

- Component: address-input
- PascalCase: AddressInput
- Description: an input for searching or manually entering an address
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div> with role="group"
- CSS class: .address-input
- Interactive: yes

## Key Behaviors

- Renders a `<div role="group">` named by `label`, holding the consumer's labelled address fields
- Exception to the suffix table: an `-input` whose root is not an `<input>`, because an address is several values and its fields depend on the country
- The consumer chooses the fields and their order (one `<textarea autocomplete="street-address">` suits every country), each with its own `autocomplete` token
- No value of its own: the fields are the form controls, so the form submits and resets them
- Spreads `restProps` onto the root `<div>`
- All text content (group label, field labels, error messages) comes from the consumer

## ARIA

- `role="group"` + `aria-label` (from `label`) names the set of fields
- Each field has its own visible `<label>`; the consumer sets `aria-invalid` and `aria-errormessage` on a field that fails validation

## Keyboard

- No keyboard interactions of its own; Tab moves through the consumer's fields

## Props

- `label`: string (required) (default: —) — The group's accessible name, on `aria-label`
- `children`: slot (required) (default: —) — The labelled address fields
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div role="group"> element with class="address-input"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.address-input` in css-style-sheet-template.css
- [MDN input type=text](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)
- [MDN autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
