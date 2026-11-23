# ItyopyaFaydaIdentificationNumberView

## Metadata

- Component: ityopya-fayda-identification-number-view
- PascalCase: ItyopyaFaydaIdentificationNumberView
- Description: a read-only display of Ethiopia's Fayda Identification Number (FIN)
- Purpose: Shows Ethiopia's Fayda Identification Number (FIN) as read-only text, so it is displayed one way wherever it appears. Use the input to collect it.
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .ityopya-fayda-identification-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `ityopya-fayda-identification-number-view`
- Format: Twelve digits issued by the National ID Program (NIDP). The number encodes no personal attributes and no check-digit algorithm is published, so only the length and digits can be checked. Do not confuse it with the six-digit Fayda alternative number used to link bank accounts.
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

- [x] Renders <span> element with class="ityopya-fayda-identification-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .ityopya-fayda-identification-number-view in css-style-sheet-template.css
- Companion: ItyopyaFaydaIdentificationNumberInput
- [Fayda ID](https://en.wikipedia.org/wiki/Fayda_ID)
