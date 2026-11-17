# RecordListItem

## Metadata

- Component: record-list-item
- PascalCase: RecordListItem
- Description: one record in a record list, with its status and last update around the consumer's content
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="record-list-item">` with parts `-status`, `-updated`
- `status` (the consumer's code) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-updated` is a `<time datetime>`, shown only when its label is given

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `children`: slot — the record itself, written by the consumer
- `status`: string (optional) — the record's status, as the consumer's code; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `updated`: string (optional) — when the record was last updated
- `updatedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `...restProps`: any — additional HTML attributes spread onto the root
- `entryState`: `"withheld"` | `"entered-in-error"` (optional) -- a withheld record shows only `entryStateLabel`, never its content; one entered in error keeps its content struck through in `<del class="record-list-item-entry">`, with `entryStateLabel`. Rendered as `data-entry-state`; neither is ever silently removed (spec/lessons/zoblocks)
- `entryStateLabel`: string -- that state in the consumer's words, in `-entry-state`; required with `entryState` (a development warning says so)

## Acceptance Criteria

- [x] Renders <li> with class="record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .record-list-item in css-style-sheet-template.css
- IPS Composition section: https://hl7.org/fhir/uv/ips/StructureDefinition-Composition-uv-ips.html
- Spec: spec/healthcare-ui/index.md
