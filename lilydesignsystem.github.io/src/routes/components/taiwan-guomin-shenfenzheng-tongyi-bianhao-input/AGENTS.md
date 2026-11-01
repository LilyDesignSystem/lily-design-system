# TaiwanGuominShenfenzhengTongyiBianhaoInput

## Metadata

- Component: taiwan-guomin-shenfenzheng-tongyi-bianhao-input
- PascalCase: TaiwanGuominShenfenzhengTongyiBianhaoInput
- Description: an input for entering Taiwan's National Identification Card Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .taiwan-guomin-shenfenzheng-tongyi-bianhao-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `taiwan-guomin-shenfenzheng-tongyi-bianhao-input`
- Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.
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

- [x] Renders <input> element with class="taiwan-guomin-shenfenzheng-tongyi-bianhao-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .taiwan-guomin-shenfenzheng-tongyi-bianhao-input in css-style-sheet-template.css
- Companion: TaiwanGuominShenfenzhengTongyiBianhaoView
- Wikipedia: [National identification card (Taiwan)](<https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)>)
