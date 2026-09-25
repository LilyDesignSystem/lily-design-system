# PilipinasPhilhealthIdentificationNumberInput

## Metadata

- Component: pilipinas-philhealth-identification-number-input
- PascalCase: PilipinasPhilhealthIdentificationNumberInput
- Description: an input for entering the Philippines's PhilHealth Identification Number (PIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .pilipinas-philhealth-identification-number-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `pilipinas-philhealth-identification-number-input`
- Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
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

- [x] Renders <input> element with class="pilipinas-philhealth-identification-number-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pilipinas-philhealth-identification-number-input in css-style-sheet-template.css
- Companion: PilipinasPhilhealthIdentificationNumberView
- Wikipedia: [PhilHealth](https://en.wikipedia.org/wiki/PhilHealth)
