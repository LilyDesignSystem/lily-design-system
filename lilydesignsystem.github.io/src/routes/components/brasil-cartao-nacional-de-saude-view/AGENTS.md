# BrasilCartaoNacionalDeSaudeView

## Metadata

- Component: brasil-cartao-nacional-de-saude-view
- PascalCase: BrasilCartaoNacionalDeSaudeView
- Description: a read-only display of Brazil's Cartão Nacional de Saúde (CNS)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .brasil-cartao-nacional-de-saude-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `brasil-cartao-nacional-de-saude-view`
- Format: Fifteen-digit number issued by Brazil's Sistema Único de Saúde (SUS), grouped as NNN NNNN NNNN NNNN. Numbers starting 1 or 2 are definitive (linked to the national civil registry); numbers starting 7, 8, or 9 are provisional. Both forms are validated with a weighted-sum Modulus-11 check across all 15 digits.
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

- [x] Renders <span> element with class="brasil-cartao-nacional-de-saude-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .brasil-cartao-nacional-de-saude-view in css-style-sheet-template.css
- Companion: BrasilCartaoNacionalDeSaudeInput
- Wikipedia: [CPF number (Cartão Nacional de Saúde)](https://en.wikipedia.org/wiki/CPF_number)
