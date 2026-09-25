# MisrAlRaqmAlQawmiView

## Metadata

- Component: misr-al-raqm-al-qawmi-view
- PascalCase: MisrAlRaqmAlQawmiView
- Description: a read-only display of Egypt's الرقم القومي (Al-Raqm Al-Qawmi)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .misr-al-raqm-al-qawmi-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `misr-al-raqm-al-qawmi-view`
- Format: Fourteen digits. The first digit encodes century of birth (2 for 1900-1999, 3 for 2000-2099); the next six encode date of birth (YYMMDD); the next two encode governorate of birth/registration; the next four are a serial number whose own parity encodes sex (odd male, even female); the fourteenth digit is a check digit.
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

- [x] Renders <span> element with class="misr-al-raqm-al-qawmi-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .misr-al-raqm-al-qawmi-view in css-style-sheet-template.css
- Companion: MisrAlRaqmAlQawmiInput
- Wikipedia: [Egyptian National Identity Card](https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card)
