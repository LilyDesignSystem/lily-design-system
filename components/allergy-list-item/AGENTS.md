# AllergyListItem

## Metadata

- Component: allergy-list-item
- PascalCase: AllergyListItem
- Description: one allergy or intolerance in an allergy list, with substance, reaction, severity and last update
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .allergy-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="allergy-list-item">` with parts `-substance`, `-reaction`, `-severity` and `-updated`
- `severity` (`mild`, `moderate`, `severe`, the FHIR AllergyIntolerance reaction severity) renders as `data-severity`, and its words as text
- `-updated` is a `<time datetime>`, shown only when `updatedLabel` is given
- The substance is never truncated

## ARIA

- No ARIA beyond the native `<li>`; severity is text, never colour alone

## Keyboard

- Not interactive

## Props

- `substance`: string (required) — what the patient reacts to
- `reaction`: string (optional) — the manifestation
- `severity`: "mild" | "moderate" | "severe" (optional) — rendered as `data-severity`
- `severityLabel`: string (optional) — the severity in words
- `updated`: string (optional) — when the record was last updated, for `<time datetime>`
- `updatedLabel`: string (optional) — that date as the consumer writes it
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <li> with class="allergy-list-item"
- [x] Each part renders, the date as a `<time datetime>`
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .allergy-list-item in css-style-sheet-template.css
- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
