# GhanaCardPersonalIdentificationNumberInput

## Metadata

- Component: ghana-card-personal-identification-number-input
- PascalCase: GhanaCardPersonalIdentificationNumberInput
- Description: an input for entering Ghana's Ghana Card PIN
- Purpose: Collects Ghana's Ghana Card PIN in one field, with autocomplete and spellcheck off so the number is neither saved by the browser nor sent to a spellchecker. Use it where staff or the person enter that number.
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .ghana-card-personal-identification-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `ghana-card-personal-identification-number-input`
- Format: A three-letter prefix (GHA for citizens), a hyphen, a run of digits and a hyphen before a final check character (GHA-123456789-1). Sources disagree on the length of the digit run (eight, nine or ten), and the National Identification Authority does not publish the check-character algorithm, so check the prefix and shape, not the checksum.
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

- [x] Renders <input> element with class="ghana-card-personal-identification-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .ghana-card-personal-identification-number-input in css-style-sheet-template.css
- Companion: GhanaCardPersonalIdentificationNumberView
- [Ghana Card](https://en.wikipedia.org/wiki/Ghana_Card)
- [National Identification Authority: The GhanaCard](https://nia.gov.gh/the-ghanacard-introduction/)
