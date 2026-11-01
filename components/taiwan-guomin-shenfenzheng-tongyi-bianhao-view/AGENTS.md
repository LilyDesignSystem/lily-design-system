# TaiwanGuominShenfenzhengTongyiBianhaoView

## Metadata

- Component: taiwan-guomin-shenfenzheng-tongyi-bianhao-view
- PascalCase: TaiwanGuominShenfenzhengTongyiBianhaoView
- Description: a read-only display of Taiwan's National Identification Card Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .taiwan-guomin-shenfenzheng-tongyi-bianhao-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `taiwan-guomin-shenfenzheng-tongyi-bianhao-view`
- Format: One uppercase letter for the household-registration office, then nine digits. The first digit is 1 for a male and 2 for a female citizen (8 or 9 for a foreign resident), and the last digit is a check digit. The letter is converted to a two-digit number (A=10, B=11 and so on in the official order A-H, J-N, P-V, X, Y, W, Z, I, O), the eleven resulting digits are multiplied by the weights 1,9,8,7,6,5,4,3,2,1,1, and the sum must be a multiple of 10.
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible name via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .taiwan-guomin-shenfenzheng-tongyi-bianhao-view in css-style-sheet-template.css
- Companion: TaiwanGuominShenfenzhengTongyiBianhaoInput
- Wikipedia: [National identification card (Taiwan)](<https://en.wikipedia.org/wiki/National_identification_card_(Taiwan)>)
