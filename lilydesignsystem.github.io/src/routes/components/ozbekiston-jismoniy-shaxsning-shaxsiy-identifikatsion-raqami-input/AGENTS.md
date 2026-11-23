# OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput

## Metadata

- Component: ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input
- PascalCase: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput
- Description: an input for entering Uzbekistan's Personal identification number (JShShIR / PINFL)
- Purpose: Collects Uzbekistan's Personal identification number (JShShIR / PINFL) in one field, with autocomplete and spellcheck off so the number is neither saved by the browser nor sent to a spellchecker. Use it where staff or the person enter that number.
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input`
- Format: Fourteen digits in five groups (Cabinet of Ministers Resolution No. 177 of 2022): a first digit from 1 to 6 for sex and century of birth, then groups for the date of birth and the issuing district, a three-digit sequence and a final check digit. The check-digit formula is not published, so check the length, the digits and the first digit's range.
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

- [x] Renders <input> element with class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input in css-style-sheet-template.css
- Companion: OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView
- [Kun.uz: Where to find your PINFL](https://kun.uz/en/news/2026/01/26/how-to-find-your-pinfl)
- [Uzbekistan passport](https://en.wikipedia.org/wiki/Uzbekistan_passport)
