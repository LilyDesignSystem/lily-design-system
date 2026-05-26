# UnitedStatesSocialSecurityNumberInput

## Metadata

- Component: united-states-social-security-number-input
- PascalCase: UnitedStatesSocialSecurityNumberInput
- Description: an input for entering a US Social Security number
- HTML tag: <input>
- CSS class: .united-states-social-security-number-input
- Interactive: no

## Key Behaviors

- Renders as `<input type="text">` with pattern validation for SSN format
- Pattern: `[0-9]{3}-[0-9]{2}-[0-9]{4}` (XXX-XX-XXXX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive PII
- Supports two-way binding
- Pattern is defined as a constant for validation

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## Keyboard

- Standard text input keyboard behavior
- Users type digits and hyphens in the format XXX-XX-XXXX

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Acceptance Criteria

- [ ] Renders <input> element with class="united-states-social-security-number-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-states-social-security-number-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/united-states-social-security-number-input.html
- Social Security Number format: https://www.ssa.gov/employer/randomization.html
