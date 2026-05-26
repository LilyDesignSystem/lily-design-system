# AustraliaIndividualHealthcareIdentifierInput

## Metadata

- Component: australia-individual-healthcare-identifier-input
- PascalCase: AustraliaIndividualHealthcareIdentifierInput
- Description: an input for entering Australia's Individual Healthcare Identifier (IHI)
- HTML tag: <input>
- CSS class: .australia-individual-healthcare-identifier-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `australia-individual-healthcare-identifier-input`
- Format: 16 digits assigned by the Healthcare Identifiers Service
- `autocomplete="off"` to protect sensitive identifiers
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

- [ ] Renders <input> element with class="australia-individual-healthcare-identifier-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .australia-individual-healthcare-identifier-input in css-style-sheet-template.css
- Companion: AustraliaIndividualHealthcareIdentifierView
- Wikipedia: https://en.wikipedia.org/wiki/My_Health_Record
