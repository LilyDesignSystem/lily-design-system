# QazaqstanZhekeSaikestendiruNomiriInput

## Metadata

- Component: qazaqstan-zheke-saikestendiru-nomiri-input
- PascalCase: QazaqstanZhekeSaikestendiruNomiriInput
- Description: an input for entering Kazakhstan's Individual Identification Number (IIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .qazaqstan-zheke-saikestendiru-nomiri-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `qazaqstan-zheke-saikestendiru-nomiri-input`
- Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.
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

- [x] Renders <input> element with class="qazaqstan-zheke-saikestendiru-nomiri-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .qazaqstan-zheke-saikestendiru-nomiri-input in css-style-sheet-template.css
- Companion: QazaqstanZhekeSaikestendiruNomiriView
- [OECD: Kazakhstan TIN](https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf)
- [eGov.kz: Individual identification number](https://egov.kz/cms/en/articles/iin_info)
