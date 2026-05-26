# PortugalNumeroDeIdentificacaoFiscalView

## Metadata

- Component: portugal-numero-de-identificacao-fiscal-view
- PascalCase: PortugalNumeroDeIdentificacaoFiscalView
- Description: a read-only display of Portugal's Número de Identificação Fiscal (NIF)
- HTML tag: <span>
- CSS class: .portugal-numero-de-identificacao-fiscal-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `portugal-numero-de-identificacao-fiscal-view` and `role="text"`
- Format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.)
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop
- `role="text"` so the identifier announces as a single unit

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible name override via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="portugal-numero-de-identificacao-fiscal-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .portugal-numero-de-identificacao-fiscal-view in css-style-sheet-template.css
- Companion: PortugalNumeroDeIdentificacaoFiscalInput
- Wikipedia: https://en.wikipedia.org/wiki/Personal_identification_number_(Portugal)
