# AllergyRecordList

## Metadata

- Component: allergy-record-list
- PascalCase: AllergyRecordList
- Description: a list of a patient's allergies and intolerances, whose status is never blank
- Purpose: Lists a patient's allergies and intolerances, and never leaves the status blank.
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <ul>
- CSS class: .allergy-record-list
- Interactive: no

## Key Behaviors

- Renders `<ul class="allergy-record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.allergy-record-list-status`, so the list is never blank
- Never says none are known beside an entry (HC-C17): for `none-known` with an entry, the entry stays, `conflictLabel` replaces `statusLabel` as the item and the name, and `data-status` is `conflict`; with no `conflictLabel`, the status words go and development warns. An entry that is refuted or entered in error does not count
- Holds `allergy-record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## Keyboard

- Not interactive

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `conflictLabel`: string (optional) — your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; the list never says both
- `children`: slot (optional) — `allergy-record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). The rules are `AllergyRules` in `LilyCore` and `lily-core`, one test each.

- Apple: `AllergyRecordList(status:statusLabel:label:content:)` in `LilyUI`: a labelled container named by `label`, else `statusLabel`; for any status but `known` the status words are its one item. A missing `statusLabel` prints a development warning.
- Android: `AllergyRecordList(status, statusLabel, label) { … }` in `lily-compose`: a traversal group with the same rules.

## Acceptance Criteria

- [x] Renders <ul> with class="allergy-record-list"
- [x] Each status other than known is the list's one item, in the consumer's words
- [x] A missing status warns in development
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

- In Svelte, React, Solid, Vue and Angular the entries are read from the page, so HTML from a server shows the status as given until the script runs. Nunjucks and Blazor decide on the server. In HTML and Alpine the markup is yours: write `data-status="conflict"` and your words.
- In Blazor and Compose only Lily's own items are counted.
- An entry about someone other than the patient counts.

## References

- Documentation: index.md
- CSS class: .allergy-record-list in css-style-sheet-template.css
- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
