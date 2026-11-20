# QazaqstanZhekeSaikestendiruNomiriView

## Metadata

- Component: qazaqstan-zheke-saikestendiru-nomiri-view
- PascalCase: QazaqstanZhekeSaikestendiruNomiriView
- Description: a read-only display of Kazakhstan's Individual Identification Number (IIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .qazaqstan-zheke-saikestendiru-nomiri-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `qazaqstan-zheke-saikestendiru-nomiri-view`
- Format: Twelve digits: the date of birth as YYMMDD, a digit for century and sex, a four-digit serial and a check digit. The check digit is the sum of the first eleven digits times the weights 1 to 11, modulo 11; if that is 10, repeat with the weights 3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2, and if it is 10 again the number is not issued.
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

- [x] Renders <span> element with class="qazaqstan-zheke-saikestendiru-nomiri-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .qazaqstan-zheke-saikestendiru-nomiri-view in css-style-sheet-template.css
- Companion: QazaqstanZhekeSaikestendiruNomiriInput
- [OECD: Kazakhstan TIN](https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Kazakhstan-TIN.pdf)
- [eGov.kz: Individual identification number](https://egov.kz/cms/en/articles/iin_info)
