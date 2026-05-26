# LietuvaAsmensKodasView

## Metadata

- Component: lietuva-asmens-kodas-view
- PascalCase: LietuvaAsmensKodasView
- Description: a read-only display of Lithuania's Asmens kodas
- HTML tag: <span>
- CSS class: .lietuva-asmens-kodas-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `lietuva-asmens-kodas-view` and `role="text"`
- Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit
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

- [ ] Renders <span> element with class="lietuva-asmens-kodas-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .lietuva-asmens-kodas-view in css-style-sheet-template.css
- Companion: LietuvaAsmensKodasInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Lithuania
