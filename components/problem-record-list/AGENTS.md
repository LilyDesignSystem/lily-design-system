# ProblemRecordList

## Metadata

- Component: problem-record-list
- PascalCase: ProblemRecordList
- Description: a list of a patient's problems and conditions, whose status is never blank
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <ul>
- CSS class: .problem-record-list
- Interactive: no

## Key Behaviors

- Renders `<ul class="problem-record-list">` named by `aria-label` (`label`, else `statusLabel`)
- `status` is required and renders as `data-status`: `known`, `none-known`, `not-recorded`, `unavailable`, `omitted`, `not-applicable`
- For any status but `known`, `statusLabel` is the list's one item, `li.problem-record-list-status`, so the list is never blank
- Holds `problem-record-list-item` items when the status is `known`
- A missing `status` or `statusLabel` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- A `<ul>` named by `aria-label`; the status is text, never an icon or a colour alone

## Keyboard

- Not interactive

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `children`: slot (optional) — `problem-record-list-item` items
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <ul> with class="problem-record-list"
- [x] Each status other than known is the list's one item, in the consumer's words
- [x] A missing status warns in development
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .problem-record-list in css-style-sheet-template.css
- FHIR Condition: https://hl7.org/fhir/R4/condition.html
- Spec: spec/healthcare-ui/index.md
