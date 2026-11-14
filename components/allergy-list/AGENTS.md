# AllergyList

## Metadata

- Component: allergy-list
- PascalCase: AllergyList
- Description: a list of a patient's allergies and intolerances, whose status is never blank
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <ul>
- CSS class: .allergy-list
- Interactive: no

## Key Behaviors

- Renders `<ul class="allergy-list">` with `data-status` and `aria-label`
- `status` is required: `known`, `none-known`, `not-recorded` or `unavailable`
- For any status but `known`, `statusLabel` is the list's one item, `li.allergy-list-status`, so the list is never blank
- Holds `allergy-list-item` children for status `known`
- A missing `status` or `statusLabel` raises a development warning

## ARIA

- A `<ul>` named by `aria-label` (the status words, or `label`). The status is text, never an icon or a colour alone

## Keyboard

- Not interactive

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `allergy-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <ul> with class="allergy-list"
- [x] Each status renders its words; for statuses other than `known` they are the one item
- [x] The list is named by its status
- [x] A missing status raises a development warning
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .allergy-list in css-style-sheet-template.css
- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
