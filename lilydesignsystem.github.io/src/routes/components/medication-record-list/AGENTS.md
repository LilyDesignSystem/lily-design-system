# MedicationRecordList

## Metadata

- Component: medication-record-list
- PascalCase: MedicationRecordList
- Description: a list of a patient's medicines, whose status is never blank
- Purpose: Lists a patient's medicines, and never leaves the status blank.
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <ul>
- CSS class: .medication-record-list
- Interactive: no

## Key Behaviors

- Renders `<ul class="medication-record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.medication-record-list-status`, so the list is never blank
- Holds `medication-record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## Keyboard

- Not interactive

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `medication-record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

- Apple: A pattern: the generic `RecordList` and `RecordListItem` hold the rules (never blank, withheld and entered-in-error never silent, whose record first) and the record itself is a Lily view, so mobile ships no type of its own for this list (`pattern` in [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv)).
- Android: The same pattern in `lily-compose`.

## Acceptance Criteria

- [x] Renders <ul> with class="medication-record-list"
- [x] Each status other than known is the list's one item, in the consumer's words
- [x] A missing status warns in development
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .medication-record-list in css-style-sheet-template.css
- FHIR MedicationStatement: https://hl7.org/fhir/R4/medicationstatement.html
- Spec: spec/healthcare-ui/index.md
