# SlovenskoRodneCisloView

## Metadata

- Component: slovensko-rodne-cislo-view
- PascalCase: SlovenskoRodneCisloView
- Description: a read-only display of Slovakia's Rodné číslo (RČ)
- HTML tag: <span>
- CSS class: .slovensko-rodne-cislo-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `slovensko-rodne-cislo-view` and `role="text"`
- Format: 10 digits in the form YYMMDDCCCX where MM is 01-12 for males and 51-62 for females; X is a check digit and the whole number is divisible by 11
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

- [ ] Renders <span> element with class="slovensko-rodne-cislo-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slovensko-rodne-cislo-view in css-style-sheet-template.css
- Companion: SlovenskoRodneCisloInput
- Wikipedia: https://en.wikipedia.org/wiki/National_identification_number#Slovakia
