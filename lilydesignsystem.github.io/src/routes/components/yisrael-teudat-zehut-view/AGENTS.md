# YisraelTeudatZehutView

## Metadata

- Component: yisrael-teudat-zehut-view
- PascalCase: YisraelTeudatZehutView
- Description: a read-only display of Israel's Teudat Zehut (תעודת זהות)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .yisrael-teudat-zehut-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `yisrael-teudat-zehut-view`
- Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
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

- [x] Renders <span> element with class="yisrael-teudat-zehut-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .yisrael-teudat-zehut-view in css-style-sheet-template.css
- Companion: YisraelTeudatZehutInput
- Wikipedia: [Israeli identity card](https://en.wikipedia.org/wiki/Israeli_identity_card)
