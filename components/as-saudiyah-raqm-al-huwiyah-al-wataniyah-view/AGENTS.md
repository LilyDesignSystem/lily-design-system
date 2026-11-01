# AsSaudiyahRaqmAlHuwiyahAlWataniyahView

## Metadata

- Component: as-saudiyah-raqm-al-huwiyah-al-wataniyah-view
- PascalCase: AsSaudiyahRaqmAlHuwiyahAlWataniyahView
- Description: a read-only display of Saudi Arabia's National Identification Number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .as-saudiyah-raqm-al-huwiyah-al-wataniyah-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `as-saudiyah-raqm-al-huwiyah-al-wataniyah-view`
- Format: Ten digits. The first digit is 1 for a Saudi citizen and 2 for a resident (the iqama number), and the last digit is a check digit under the Luhn algorithm: counting from the right, every second digit is doubled (subtracting 9 when the result exceeds 9), and the total must be a multiple of 10.
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

- [x] Renders <span> element with class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .as-saudiyah-raqm-al-huwiyah-al-wataniyah-view in css-style-sheet-template.css
- Companion: AsSaudiyahRaqmAlHuwiyahAlWataniyahInput
- Wikipedia: [National identity card](https://en.wikipedia.org/wiki/National_identity_card)
