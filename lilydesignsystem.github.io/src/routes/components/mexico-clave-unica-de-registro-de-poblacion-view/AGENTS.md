# MexicoClaveUnicaDeRegistroDePoblacionView

## Metadata

- Component: mexico-clave-unica-de-registro-de-poblacion-view
- PascalCase: MexicoClaveUnicaDeRegistroDePoblacionView
- Description: a read-only display of Mexico's Clave Única de Registro de Población (CURP)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .mexico-clave-unica-de-registro-de-poblacion-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `mexico-clave-unica-de-registro-de-poblacion-view`
- Format: Eighteen-character alphanumeric code built from name, date of birth, sex, and state of birth: first letter of the first surname plus its first internal vowel; first letter of the second surname (or X if none); first letter of the given name; six-digit date of birth (YYMMDD); H or M for sex (X for non-binary); a two-letter state code (NE for those born abroad); a consonant from each surname and the given name; then two further disambiguating characters. No trailing check digit.
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

- [x] Renders <span> element with class="mexico-clave-unica-de-registro-de-poblacion-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .mexico-clave-unica-de-registro-de-poblacion-view in css-style-sheet-template.css
- Companion: MexicoClaveUnicaDeRegistroDePoblacionInput
- Wikipedia: [Unique Population Registry Code](https://en.wikipedia.org/wiki/Unique_Population_Registry_Code)
