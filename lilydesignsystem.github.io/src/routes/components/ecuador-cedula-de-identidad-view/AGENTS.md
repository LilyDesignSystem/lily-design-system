# EcuadorCedulaDeIdentidadView

## Metadata

- Component: ecuador-cedula-de-identidad-view
- PascalCase: EcuadorCedulaDeIdentidadView
- Description: a read-only display of Ecuador's Cedula de Identidad Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .ecuador-cedula-de-identidad-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `ecuador-cedula-de-identidad-view`
- Format: Ten digits: a two-digit province code (01 to 24, or 30 for those born abroad), a third digit below 6 for a natural person, six more digits, and a check digit. The first nine digits are multiplied alternately by 2 and 1 (starting with 2), subtracting 9 from any product above 9, and the check digit brings the sum to the next multiple of 10.
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible name via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="ecuador-cedula-de-identidad-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ecuador-cedula-de-identidad-view in css-style-sheet-template.css
- Companion: EcuadorCedulaDeIdentidadInput
- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)
