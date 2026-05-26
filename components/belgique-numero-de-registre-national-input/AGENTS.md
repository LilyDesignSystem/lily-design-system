# BelgiqueNumeroDeRegistreNationalInput

## Metadata

- Component: belgique-numero-de-registre-national-input
- PascalCase: BelgiqueNumeroDeRegistreNationalInput
- Description: an input for entering Belgium's Numéro de Registre National / Rijksregisternummer (NRN)
- HTML tag: <input>
- CSS class: .belgique-numero-de-registre-national-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `belgique-numero-de-registre-national-input`
- Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit
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

- [ ] Renders <input> element with class="belgique-numero-de-registre-national-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .belgique-numero-de-registre-national-input in css-style-sheet-template.css
- Companion: BelgiqueNumeroDeRegistreNationalView
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Belgium
