# AustraliaIndividualHealthcareIdentifierView

## Metadata

- Component: australia-individual-healthcare-identifier-view
- PascalCase: AustraliaIndividualHealthcareIdentifierView
- Description: a read-only display of Australia's Individual Healthcare Identifier (IHI)
- HTML tag: <span>
- CSS class: .australia-individual-healthcare-identifier-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `australia-individual-healthcare-identifier-view` and `role="text"`
- Format: 16 digits assigned by the Healthcare Identifiers Service
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

- [ ] Renders <span> element with class="australia-individual-healthcare-identifier-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .australia-individual-healthcare-identifier-view in css-style-sheet-template.css
- Companion: AustraliaIndividualHealthcareIdentifierInput
- Wikipedia: https://en.wikipedia.org/wiki/My_Health_Record
