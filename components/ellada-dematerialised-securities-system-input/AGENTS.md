# ElladaDematerialisedSecuritiesSystemInput

## Metadata

- Component: ellada-dematerialised-securities-system-input
- PascalCase: ElladaDematerialisedSecuritiesSystemInput
- Description: an input for entering Greece's Dematerialised Securities System (DSS)
- HTML tag: <input>
- CSS class: .ellada-dematerialised-securities-system-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `ellada-dematerialised-securities-system-input`
- Format: 10 digits linked to the investor's personal details (name, ID number, passport number, tax registration number) and managed by the Central Securities Depository of Greece
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

- [ ] Renders <input> element with class="ellada-dematerialised-securities-system-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ellada-dematerialised-securities-system-input in css-style-sheet-template.css
- Companion: ElladaDematerialisedSecuritiesSystemView
- Wikipedia: https://en.wikipedia.org/wiki/Central_Securities_Depository
