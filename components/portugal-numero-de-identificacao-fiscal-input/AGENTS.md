# PortugalNumeroDeIdentificacaoFiscalInput

## Metadata

- Component: portugal-numero-de-identificacao-fiscal-input
- PascalCase: PortugalNumeroDeIdentificacaoFiscalInput
- Description: an input for entering Portugal's Número de Identificação Fiscal (NIF)
- HTML tag: <input>
- CSS class: .portugal-numero-de-identificacao-fiscal-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `portugal-numero-de-identificacao-fiscal-input`
- Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.)
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

- [ ] Renders <input> element with class="portugal-numero-de-identificacao-fiscal-input"
- [ ] Has aria-label attribute
- [ ] Pattern attribute matches documented format
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .portugal-numero-de-identificacao-fiscal-input in css-style-sheet-template.css
- Companion: PortugalNumeroDeIdentificacaoFiscalView
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)
