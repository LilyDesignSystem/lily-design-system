# ImmunizationRecordList

## Metadata

- Component: immunization-record-list
- PascalCase: ImmunizationRecordList
- Description: a list of a patient's immunizations, whose status is never blank
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <ul>
- CSS class: .immunization-record-list
- Interactive: no

## Key Behaviors

- Renders `<ul class="immunization-record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.immunization-record-list-status`, so the list is never blank
- Holds `immunization-record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## Keyboard

- Not interactive

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `immunization-record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

- Apple: A pattern: the generic `RecordList` and `RecordListItem` hold the rules (never blank, withheld and entered-in-error never silent, whose record first) and the record itself is a Lily view, so mobile ships no type of its own for this list (`pattern` in [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv)).
- Android: The same pattern in `lily-compose`.

## Acceptance Criteria

- [x] Renders <ul> with class="immunization-record-list"
- [x] Each status other than known is the list's one item, in the consumer's words
- [x] A missing status warns in development
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .immunization-record-list in css-style-sheet-template.css
- FHIR Immunization: https://hl7.org/fhir/R4/immunization.html
- Spec: spec/healthcare-ui/index.md
