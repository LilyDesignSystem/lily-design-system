# ChileRolUnicoNacionalView

## Metadata

- Component: chile-rol-unico-nacional-view
- PascalCase: ChileRolUnicoNacionalView
- Description: a read-only display of Chile's Rol Único Nacional (RUN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .chile-rol-unico-nacional-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `chile-rol-unico-nacional-view`
- Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="chile-rol-unico-nacional-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .chile-rol-unico-nacional-view in css-style-sheet-template.css
- Companion: ChileRolUnicoNacionalInput
- Wikipedia: [RUT](https://en.wikipedia.org/wiki/RUT)
