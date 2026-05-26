# BelgiqueNumeroDeRegistreNationalView

## Metadata

- Component: belgique-numero-de-registre-national-view
- PascalCase: BelgiqueNumeroDeRegistreNationalView
- Description: a read-only display of Belgium's Numéro de Registre National / Rijksregisternummer (NRN)
- HTML tag: <span>
- CSS class: .belgique-numero-de-registre-national-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `belgique-numero-de-registre-national-view` and `role="text"`
- Format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop
- `role="text"` so the identifier announces as a single unit

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible name override via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="belgique-numero-de-registre-national-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .belgique-numero-de-registre-national-view in css-style-sheet-template.css
- Companion: BelgiqueNumeroDeRegistreNationalInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Belgium
