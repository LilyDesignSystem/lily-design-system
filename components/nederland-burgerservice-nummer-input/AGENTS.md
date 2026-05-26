# NederlandBurgerserviceNummerInput

## Metadata

- Component: nederland-burgerservice-nummer-input
- PascalCase: NederlandBurgerserviceNummerInput
- Description: an input for entering Netherlands's Burgerservicenummer (BSN)
- HTML tag: <input>
- CSS class: .nederland-burgerservice-nummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `nederland-burgerservice-nummer-input`
- Format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm
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

- [ ] Renders <input> element with class="nederland-burgerservice-nummer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .nederland-burgerservice-nummer-input in css-style-sheet-template.css
- Companion: NederlandBurgerserviceNummerView
- Wikipedia: https://en.wikipedia.org/wiki/Burgerservicenummer
