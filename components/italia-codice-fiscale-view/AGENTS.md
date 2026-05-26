# ItaliaCodiceFiscaleView

## Metadata

- Component: italia-codice-fiscale-view
- PascalCase: ItaliaCodiceFiscaleView
- Description: a read-only display of Italy's Codice fiscale (CF)
- HTML tag: <span>
- CSS class: .italia-codice-fiscale-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `italia-codice-fiscale-view` and `role="text"`
- Format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character
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

- [ ] Renders <span> element with class="italia-codice-fiscale-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .italia-codice-fiscale-view in css-style-sheet-template.css
- Companion: ItaliaCodiceFiscaleInput
- Wikipedia: https://en.wikipedia.org/wiki/Italian_fiscal_code
