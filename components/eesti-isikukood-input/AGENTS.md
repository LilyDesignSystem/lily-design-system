# EestiIsikukoodInput

## Metadata

- Component: eesti-isikukood-input
- PascalCase: EestiIsikukoodInput
- Description: an input for entering Estonia's Isikukood (IK)
- HTML tag: <input>
- CSS class: .eesti-isikukood-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `eesti-isikukood-input`
- Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum
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

- [ ] Renders <input> element with class="eesti-isikukood-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .eesti-isikukood-input in css-style-sheet-template.css
- Companion: EestiIsikukoodView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Estonia
