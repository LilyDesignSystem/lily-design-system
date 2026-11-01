# ColombiaCedulaDeCiudadaniaView

## Metadata

- Component: colombia-cedula-de-ciudadania-view
- PascalCase: ColombiaCedulaDeCiudadaniaView
- Description: a read-only display of Colombia's Cedula de Ciudadania Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .colombia-cedula-de-ciudadania-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `colombia-cedula-de-ciudadania-view`
- Format: Six to ten digits, usually written with dots as thousands separators (1.020.304.050). Newer cards carry the ten-digit Número Único de Identificación Personal (NUIP). There is no check digit.
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

- [x] Renders <span> element with class="colombia-cedula-de-ciudadania-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .colombia-cedula-de-ciudadania-view in css-style-sheet-template.css
- Companion: ColombiaCedulaDeCiudadaniaInput
- Wikipedia: [Colombian identity card](https://en.wikipedia.org/wiki/Colombian_identity_card)
