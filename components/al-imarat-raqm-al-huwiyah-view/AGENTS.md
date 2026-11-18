# AlImaratRaqmAlHuwiyahView

## Metadata

- Component: al-imarat-raqm-al-huwiyah-view
- PascalCase: AlImaratRaqmAlHuwiyahView
- Description: a read-only display of the United Arab Emirates' Emirates ID number
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .al-imarat-raqm-al-huwiyah-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `al-imarat-raqm-al-huwiyah-view`
- Format: Fifteen digits, written 784-YYYY-NNNNNNN-C: 784 (the country's ISO numeric code), four digits that are usually but not always the year of birth, a seven-digit serial and a check digit. Vendors document a Luhn check over the fifteen digits; the issuer does not publish it, so treat a failure as a warning.
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="al-imarat-raqm-al-huwiyah-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .al-imarat-raqm-al-huwiyah-view in css-style-sheet-template.css
- Companion: AlImaratRaqmAlHuwiyahInput
- [Emirates ID](https://en.wikipedia.org/wiki/Emirates_ID)
- [Microsoft Purview: U.A.E. identity card number](https://learn.microsoft.com/en-us/purview/sit-defn-uae-identity-card-number)
