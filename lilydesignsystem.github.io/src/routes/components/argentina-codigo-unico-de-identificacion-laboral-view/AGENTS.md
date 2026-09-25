# ArgentinaCodigoUnicoDeIdentificacionLaboralView

## Metadata

- Component: argentina-codigo-unico-de-identificacion-laboral-view
- PascalCase: ArgentinaCodigoUnicoDeIdentificacionLaboralView
- Description: a read-only display of Argentina's Código Único de Identificación Laboral (CUIL)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .argentina-codigo-unico-de-identificacion-laboral-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `argentina-codigo-unico-de-identificacion-laboral-view`
- Format: Displayed as XX-NNNNNNNN-X: a two-digit prefix denoting registration type/sex (historically 20 male, 27 female, though this classification was discontinued in 2012), the eight-digit DNI (national identity document) number, and a Modulus-11 check digit computed over the ten preceding digits.
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

- [x] Renders <span> element with class="argentina-codigo-unico-de-identificacion-laboral-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .argentina-codigo-unico-de-identificacion-laboral-view in css-style-sheet-template.css
- Companion: ArgentinaCodigoUnicoDeIdentificacionLaboralInput
- Wikipedia: [Código Único de Identificación Laboral](https://en.wikipedia.org/wiki/C%C3%B3digo_%C3%9Anico_de_Identificaci%C3%B3n_Laboral)
