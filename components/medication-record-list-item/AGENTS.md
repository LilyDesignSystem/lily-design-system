# MedicationRecordListItem

## Metadata

- Component: medication-record-list-item
- PascalCase: MedicationRecordListItem
- Description: one medicine in a medication record list, with its status and when it applies
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .medication-record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="medication-record-list-item">` with parts `-status`, `-effective`
- `status` (`active`, `completed`, `entered-in-error`, `intended`, `stopped`, `on-hold`, `unknown`, `not-taken`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-effective` is a `<time datetime>`, shown only when its label is given

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `children`: slot — the medicine, usually a MedicationView
- `status`: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" | "unknown" | "not-taken" (optional) — FHIR MedicationStatement status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `effective`: string (optional) — when the medicine applies, for <time datetime>
- `effectiveLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

- Apple: A pattern: the generic `RecordList` and `RecordListItem` hold the rules (never blank, withheld and entered-in-error never silent, whose record first) and the record itself is a Lily view, so mobile ships no type of its own for this list (`pattern` in [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv)).
- Android: The same pattern in `lily-compose`.

## Acceptance Criteria

- [x] Renders <li> with class="medication-record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .medication-record-list-item in css-style-sheet-template.css
- FHIR MedicationStatement: https://hl7.org/fhir/R4/medicationstatement.html
- Spec: spec/healthcare-ui/index.md
