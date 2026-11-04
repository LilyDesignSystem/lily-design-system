# IbanInput

## Metadata

- Component: iban-input
- PascalCase: IbanInput
- Description: an input for entering an International Bank Account Number (IBAN)
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in composed flows
- HTML tag: <input>
- CSS class: .iban-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `iban-input`
- Format: up to 34 letters and digits: a two-letter country code, two check digits, then the national account number (ISO 13616)
- `autocomplete="off"` to protect sensitive account numbers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `aria-label` provided from the `label` prop

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <input> element with class="iban-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .iban-input in css-style-sheet-template.css
- Companion: IbanView
- Wikipedia: https://en.wikipedia.org/wiki/International_Bank_Account_Number
