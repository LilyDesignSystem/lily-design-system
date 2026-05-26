# DeutschlandKrankenversichertennummerInput

## Metadata

- Component: deutschland-krankenversichertennummer-input
- PascalCase: DeutschlandKrankenversichertennummerInput
- Description: an input for entering Germany's Krankenversichertennummer (KVNR)
- HTML tag: <input>
- CSS class: .deutschland-krankenversichertennummer-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `deutschland-krankenversichertennummer-input`
- Format: a random capital letter followed by eight random digits and a Luhn check digit
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

- [ ] Renders <input> element with class="deutschland-krankenversichertennummer-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .deutschland-krankenversichertennummer-input in css-style-sheet-template.css
- Companion: DeutschlandKrankenversichertennummerView
- Wikipedia: https://de.wikipedia.org/wiki/Krankenversichertennummer
