# MalaysiaKadPengenalanInput

## Metadata

- Component: malaysia-kad-pengenalan-input
- PascalCase: MalaysiaKadPengenalanInput
- Description: an input for entering Malaysia's MyKad Number (NRIC)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .malaysia-kad-pengenalan-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `malaysia-kad-pengenalan-input`
- Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.
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

- [x] Renders <input> element with class="malaysia-kad-pengenalan-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malaysia-kad-pengenalan-input in css-style-sheet-template.css
- Companion: MalaysiaKadPengenalanView
- Wikipedia: [MyKad](https://en.wikipedia.org/wiki/MyKad)
