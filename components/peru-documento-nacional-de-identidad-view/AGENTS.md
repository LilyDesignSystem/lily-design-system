# PeruDocumentoNacionalDeIdentidadView

## Metadata

- Component: peru-documento-nacional-de-identidad-view
- PascalCase: PeruDocumentoNacionalDeIdentidadView
- Description: a read-only display of Peru's Documento Nacional de Identidad (DNI)
- Purpose: Shows Peru's Documento Nacional de Identidad (DNI) as read-only text, so it is displayed one way wherever it appears. Use the input to collect it.
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .peru-documento-nacional-de-identidad-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `peru-documento-nacional-de-identidad-view`
- Format: Eight digits, the Código Único de Identificación (CUI), often followed by a hyphen and a check character (10117410-2). The check character is a digit or a letter: multiply the eight digits by the weights 3, 2, 7, 6, 5, 4, 3, 2, sum them and take the remainder modulo 11, r; the digit is "65432110987"[r] and the letter "KJIHGFEDCBA"[r], and either is accepted.
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

- [x] Renders <span> element with class="peru-documento-nacional-de-identidad-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .peru-documento-nacional-de-identidad-view in css-style-sheet-template.css
- Companion: PeruDocumentoNacionalDeIdentidadInput
- [Documento Nacional de Identidad (Perú)](<https://es.wikipedia.org/wiki/Documento_Nacional_de_Identidad_(Per%C3%BA)>)
- [python-stdnum: stdnum.pe.cui](https://arthurdejong.org/python-stdnum/doc/2.2/stdnum.pe.cui)
