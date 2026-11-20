# RepublicaDominicanaCedulaDeIdentidadYElectoralView

## Metadata

- Component: republica-dominicana-cedula-de-identidad-y-electoral-view
- PascalCase: RepublicaDominicanaCedulaDeIdentidadYElectoralView
- Description: a read-only display of the Dominican Republic's Cédula de Identidad y Electoral
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .republica-dominicana-cedula-de-identidad-y-electoral-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `republica-dominicana-cedula-de-identidad-y-electoral-view`
- Format: Eleven digits, usually written 3-7-1 (001-1391820-5): a three-digit issuing office, a seven-digit sequence and a check digit computed with the Luhn algorithm over all eleven digits. A few early numbers fail the check and are still valid, so treat a Luhn failure as a warning, not a rejection.
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

- [x] Renders <span> element with class="republica-dominicana-cedula-de-identidad-y-electoral-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .republica-dominicana-cedula-de-identidad-y-electoral-view in css-style-sheet-template.css
- Companion: RepublicaDominicanaCedulaDeIdentidadYElectoralInput
- [Junta Central Electoral (República Dominicana)](<https://es.wikipedia.org/wiki/Junta_Central_Electoral_(Rep%C3%BAblica_Dominicana)>)
- [python-stdnum: stdnum.do.cedula](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.do.cedula)
