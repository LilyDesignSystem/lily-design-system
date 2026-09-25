# ChileRolUnicoNacionalInput

## Metadata

- Component: chile-rol-unico-nacional-input
- PascalCase: ChileRolUnicoNacionalInput
- Description: an input for entering Chile's Rol Único Nacional (RUN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .chile-rol-unico-nacional-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `chile-rol-unico-nacional-input`
- Format: Seven or eight digits plus a trailing check character. The check character is computed with a Modulus-11 algorithm: each body digit, read right to left, is multiplied by a repeating weight sequence 2,3,4,5,6,7; the products are summed; the check value is 11 minus the sum's Modulus-11 remainder, where a result of 11 maps to 0 and a result of 10 maps to the letter K.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="chile-rol-unico-nacional-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .chile-rol-unico-nacional-input in css-style-sheet-template.css
- Companion: ChileRolUnicoNacionalView
- Wikipedia: [RUT](https://en.wikipedia.org/wiki/RUT)
