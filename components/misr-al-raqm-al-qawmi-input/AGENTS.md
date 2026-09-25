# MisrAlRaqmAlQawmiInput

## Metadata

- Component: misr-al-raqm-al-qawmi-input
- PascalCase: MisrAlRaqmAlQawmiInput
- Description: an input for entering Egypt's الرقم القومي (Al-Raqm Al-Qawmi)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .misr-al-raqm-al-qawmi-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `misr-al-raqm-al-qawmi-input`
- Format: Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.
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

- [x] Renders <input> element with class="misr-al-raqm-al-qawmi-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .misr-al-raqm-al-qawmi-input in css-style-sheet-template.css
- Companion: MisrAlRaqmAlQawmiView
- Wikipedia: [Egyptian National Identity Card](https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card)
