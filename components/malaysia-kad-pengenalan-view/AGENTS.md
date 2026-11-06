# MalaysiaKadPengenalanView

## Metadata

- Component: malaysia-kad-pengenalan-view
- PascalCase: MalaysiaKadPengenalanView
- Description: a read-only display of Malaysia's MyKad Number (NRIC)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .malaysia-kad-pengenalan-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `malaysia-kad-pengenalan-view`
- Format: Twelve digits, usually written YYMMDD-PB-NNNG: the date of birth (year, month, day), a two-digit code for the place of birth (a state or a country), and a four-digit serial whose last digit is odd for a male and even for a female. There is no check digit.
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

- [x] Renders <span> element with class="malaysia-kad-pengenalan-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .malaysia-kad-pengenalan-view in css-style-sheet-template.css
- Companion: MalaysiaKadPengenalanInput
- Wikipedia: [MyKad](https://en.wikipedia.org/wiki/MyKad)
