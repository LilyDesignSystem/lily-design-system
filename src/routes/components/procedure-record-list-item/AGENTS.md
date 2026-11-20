# ProcedureRecordListItem

## Metadata

- Component: procedure-record-list-item
- PascalCase: ProcedureRecordListItem
- Description: one procedure in a procedure record list, with its status and when it was performed
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .procedure-record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="procedure-record-list-item">` with parts `-procedure`, `-status`, `-performed`
- `status` (`preparation`, `in-progress`, `not-done`, `on-hold`, `stopped`, `completed`, `entered-in-error`, `unknown`) renders as `data-status`, and `statusLabel` as text; a `status` without words raises a development warning
- `-performed` is a `<time datetime>`, shown only when its label is given
- The procedure is never truncated

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `procedure`: string (required) — the procedure; never truncated
- `status`: "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown" (optional) — FHIR Procedure status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `performed`: string (optional) — when it was performed, for <time datetime>
- `performedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <li> with class="procedure-record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .procedure-record-list-item in css-style-sheet-template.css
- FHIR Procedure: https://hl7.org/fhir/R4/procedure.html
- Spec: spec/healthcare-ui/index.md
