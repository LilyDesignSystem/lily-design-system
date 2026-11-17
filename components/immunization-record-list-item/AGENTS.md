# ImmunizationRecordListItem

## Metadata

- Component: immunization-record-list-item
- PascalCase: ImmunizationRecordListItem
- Description: one immunization in an immunization record list, with vaccine, date, dose and status
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .immunization-record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="immunization-record-list-item">` with parts `-vaccine`, `-occurrence`, `-dose-number`, `-status`, `-lot-number`
- `status` (`completed`, `entered-in-error`, `not-done`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-occurrence` is a `<time datetime>`, shown only when its label is given
- The vaccine is never truncated

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `vaccine`: string (required) — the vaccine given; never truncated
- `occurrence`: string (optional) — when it was given, for <time datetime>
- `occurrenceLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `doseNumberLabel`: string (optional) — the dose in words ("Dose 2 of 2")
- `status`: "completed" | "entered-in-error" | "not-done" (optional) — FHIR Immunization status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `lotNumber`: string (optional) — the vaccine's lot number
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <li> with class="immunization-record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .immunization-record-list-item in css-style-sheet-template.css
- FHIR Immunization: https://hl7.org/fhir/R4/immunization.html
- Spec: spec/healthcare-ui/index.md
