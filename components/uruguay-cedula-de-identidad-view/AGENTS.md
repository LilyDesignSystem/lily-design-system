# UruguayCedulaDeIdentidadView

## Metadata

- Component: uruguay-cedula-de-identidad-view
- PascalCase: UruguayCedulaDeIdentidadView
- Description: a read-only display of Uruguay's Cedula de Identidad Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .uruguay-cedula-de-identidad-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `uruguay-cedula-de-identidad-view`
- Format: Six or seven digits plus a trailing check digit, written 1.234.567-2. The body is left-padded with zeros to seven digits, multiplied by the weights 2,9,8,7,6,3,4 and summed, and the check digit is the amount that brings the sum to the next multiple of 10 (0 when it already is one).
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

- [x] Renders <span> element with class="uruguay-cedula-de-identidad-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .uruguay-cedula-de-identidad-view in css-style-sheet-template.css
- Companion: UruguayCedulaDeIdentidadInput
- Wikipedia: [Cédula de identidad](https://en.wikipedia.org/wiki/C%C3%A9dula_de_identidad)
