# GuatemalaCodigoUnicoDeIdentificacionView

## Metadata

- Component: guatemala-codigo-unico-de-identificacion-view
- PascalCase: GuatemalaCodigoUnicoDeIdentificacionView
- Description: a read-only display of Guatemala's Código Único de Identificación (CUI)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .guatemala-codigo-unico-de-identificacion-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `guatemala-codigo-unico-de-identificacion-view`
- Format: Thirteen digits, written 4-5-4 on the DPI card: eight assigned in sequence, one check digit, then two for the department and two for the municipality of birth (RENAP). RENAP does not publish the check-digit formula; open-source validators use weights 2 to 9 over the first eight digits, modulo 11, but that is not confirmed by the registry.
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

- [x] Renders <span> element with class="guatemala-codigo-unico-de-identificacion-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .guatemala-codigo-unico-de-identificacion-view in css-style-sheet-template.css
- Companion: GuatemalaCodigoUnicoDeIdentificacionInput
- [RENAP: ¿Qué es el CUI?](https://www.renap.gob.gt/sites/default/files/boletines-publicaciones/inforenap_163_-_08042021_-_que_es_el_cui.pdf)
- [Documento Personal de Identificación](https://es.wikipedia.org/wiki/Documento_Personal_de_Identificaci%C3%B3n)
