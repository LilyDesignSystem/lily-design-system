# CostaRicaCedulaDeIdentidadView

## Metadata

- Component: costa-rica-cedula-de-identidad-view
- PascalCase: CostaRicaCedulaDeIdentidadView
- Description: a read-only display of Costa Rica's Cédula de Identidad
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .costa-rica-cedula-de-identidad-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `costa-rica-cedula-de-identidad-view`
- Format: A province digit, a volume (tomo) of up to four digits and an entry (asiento) of up to four digits, written P-TTTT-AAAA (1-0613-0584) and often stored as nine or ten digits with the leading zeroes padded. It has no check digit, so only the parts and their lengths can be checked.
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

- [x] Renders <span> element with class="costa-rica-cedula-de-identidad-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .costa-rica-cedula-de-identidad-view in css-style-sheet-template.css
- Companion: CostaRicaCedulaDeIdentidadInput
- [Cédula de identidad (Costa Rica)](<https://es.wikipedia.org/wiki/C%C3%A9dula_de_identidad_(Costa_Rica)>)
- [python-stdnum: stdnum.cr.cpf](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.cr.cpf)
