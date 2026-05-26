# ItaliaCodiceFiscaleInput

## Metadata

- Component: italia-codice-fiscale-input
- PascalCase: ItaliaCodiceFiscaleInput
- Description: an input for entering Italy's Codice fiscale (CF)
- HTML tag: <input>
- CSS class: .italia-codice-fiscale-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `italia-codice-fiscale-input`
- Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character
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

- [ ] Renders <input> element with class="italia-codice-fiscale-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .italia-codice-fiscale-input in css-style-sheet-template.css
- Companion: ItaliaCodiceFiscaleView
- Wikipedia: https://en.wikipedia.org/wiki/Italian_fiscal_code
