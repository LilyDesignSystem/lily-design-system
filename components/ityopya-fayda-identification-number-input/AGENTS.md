# ItyopyaFaydaIdentificationNumberInput

## Metadata

- Component: ityopya-fayda-identification-number-input
- PascalCase: ItyopyaFaydaIdentificationNumberInput
- Description: an input for entering Ethiopia's Fayda Identification Number (FIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .ityopya-fayda-identification-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `ityopya-fayda-identification-number-input`
- Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.
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

- [x] Renders <input> element with class="ityopya-fayda-identification-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .ityopya-fayda-identification-number-input in css-style-sheet-template.css
- Companion: ItyopyaFaydaIdentificationNumberView
- [Fayda ID](https://en.wikipedia.org/wiki/Fayda_ID)
