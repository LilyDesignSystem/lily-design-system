# RecordList

## Metadata

- Component: record-list
- PascalCase: RecordList
- Description: a list of records from one section of a patient's record, whose status is never blank
- Purpose: Lists records from one section of a patient's record, and never leaves the status blank.
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <ul>
- CSS class: .record-list
- Interactive: no

## Key Behaviors

- Renders `<ul class="record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.record-list-status`, so the list is never blank
- Holds `record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## Keyboard

- Not interactive

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `coverageLabel`: string (optional) — what the list is a view of (window, order, what is left out, sources that did not answer); rendered first, as `<li class="record-list-coverage">`
- `children`: slot (optional) — `record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). The rules are `RecordRules` in `LilyCore` and `lily-core`.

- Apple: `RecordList(status:statusLabel:label:coverageLabel:content:)` in `LilyUI`: a labelled container, never blank; the coverage words come first.
- Android: `RecordList(status, statusLabel, label, coverageLabel) { … }` in `lily-compose`: a traversal group with the same rules.

## Acceptance Criteria

- [x] Renders <ul> with class="record-list"
- [x] Each status other than known is the list's one item, in the consumer's words
- [x] A missing status warns in development
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .record-list in css-style-sheet-template.css
- IPS Composition section: https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html
- Spec: spec/healthcare-ui/index.md
