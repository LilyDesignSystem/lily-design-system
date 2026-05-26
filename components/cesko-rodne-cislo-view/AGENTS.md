# CeskoRodneCisloView

## Metadata

- Component: cesko-rodne-cislo-view
- PascalCase: CeskoRodneCisloView
- Description: a read-only display of Czech Republic's Rodné číslo (RČ)
- HTML tag: <span>
- CSS class: .cesko-rodne-cislo-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `cesko-rodne-cislo-view` and `role="text"`
- Format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11
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

- [ ] Renders <span> element with class="cesko-rodne-cislo-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cesko-rodne-cislo-view in css-style-sheet-template.css
- Companion: CeskoRodneCisloInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic
