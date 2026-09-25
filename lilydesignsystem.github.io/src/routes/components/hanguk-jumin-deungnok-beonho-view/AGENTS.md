# HangukJuminDeungnokBeonhoView

## Metadata

- Component: hanguk-jumin-deungnok-beonho-view
- PascalCase: HangukJuminDeungnokBeonhoView
- Description: a read-only display of South Korea's Resident Registration Number (주민등록번호)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .hanguk-jumin-deungnok-beonho-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `hanguk-jumin-deungnok-beonho-view`
- Format: Thirteen digits, displayed as NNNNNN-NNNNNNN. The first six digits encode date of birth (YYMMDD); the seventh digit encodes sex and birth century; digits eight through eleven encode place of registration; the twelfth is a sequence number; the thirteenth is a Modulus-11 check digit over the preceding twelve.
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

- [x] Renders <span> element with class="hanguk-jumin-deungnok-beonho-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .hanguk-jumin-deungnok-beonho-view in css-style-sheet-template.css
- Companion: HangukJuminDeungnokBeonhoInput
- Wikipedia: [Resident registration number](https://en.wikipedia.org/wiki/Resident_registration_number)
