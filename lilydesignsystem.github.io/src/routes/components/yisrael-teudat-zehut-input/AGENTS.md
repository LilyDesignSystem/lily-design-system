# YisraelTeudatZehutInput

## Metadata

- Component: yisrael-teudat-zehut-input
- PascalCase: YisraelTeudatZehutInput
- Description: an input for entering Israel's Teudat Zehut (תעודת זהות)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .yisrael-teudat-zehut-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `yisrael-teudat-zehut-input`
- Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
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

- [x] Renders <input> element with class="yisrael-teudat-zehut-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .yisrael-teudat-zehut-input in css-style-sheet-template.css
- Companion: YisraelTeudatZehutView
- Wikipedia: [Israeli identity card](https://en.wikipedia.org/wiki/Israeli_identity_card)
