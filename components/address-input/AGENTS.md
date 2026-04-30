# AddressInput

## Metadata

- Component: address-input
- PascalCase: AddressInput
- Description: an input for searching or manually entering an address
- HTML tag: <input>
- CSS class: .address-input
- Interactive: yes

## Key Behaviors

- Renders a single `<input type="text">` with `autocomplete="street-address"` so browsers and password managers can populate it from saved addresses
- The consumer is responsible for any postcode lookup, autocomplete dropdown, or fallback to a multi-field structured form
- Supports two-way binding on the `value` prop
- Accepts `required` and `disabled` HTML attributes
- Spreads `restProps` onto the root `<input>` for consumer customization
- All text content (label, placeholder, error messages) comes through props for internationalization

## ARIA

- `aria-label` (set from `label`) provides the accessible name when no visible `<label>` element wraps the input
- `aria-required="true"` is implied when `required` is set
- `aria-invalid` and `aria-errormessage` should be set by the consumer when validation fails

## Keyboard

- Native `<input>` keyboard behaviour applies (typing, selection, clipboard)
- Tab moves focus into and out of the input

## Props

- `label`: string (required) (default: —) — Accessible name set on `aria-label`
- `value`: string (default: "") — Bindable address value
- `required`: boolean (default: false) — Whether the field is required
- `disabled`: boolean (default: false) — Whether the field is disabled
- `autocomplete`: string (default: "street-address") — HTML autocomplete token; useful values include `street-address`, `address-line1`, `address-line2`, `postal-code`
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<input>` element

## Acceptance Criteria

- [ ] Renders <input> element with class="address-input"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.address-input` in css-style-sheet-template.css
- [MDN input type=text](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)
- [MDN autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
