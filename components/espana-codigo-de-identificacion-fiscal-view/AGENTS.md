# EspanaCodigoDeIdentificacionFiscalView

## Metadata

- Component: espana-codigo-de-identificacion-fiscal-view
- PascalCase: EspanaCodigoDeIdentificacionFiscalView
- Description: a read-only display of Spain's Código de Identificación Fiscal (CIF)
- HTML tag: <span>
- CSS class: .espana-codigo-de-identificacion-fiscal-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `espana-codigo-de-identificacion-fiscal-view` and `role="text"`
- Format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used)
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

- [ ] Renders <span> element with class="espana-codigo-de-identificacion-fiscal-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .espana-codigo-de-identificacion-fiscal-view in css-style-sheet-template.css
- Companion: EspanaCodigoDeIdentificacionFiscalInput
- Wikipedia: https://en.wikipedia.org/wiki/VAT_identification_number#Spain
