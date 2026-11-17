# ProblemRecordListItem

## Metadata

- Component: problem-record-list-item
- PascalCase: ProblemRecordListItem
- Description: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .problem-record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="problem-record-list-item">` with parts `-condition`, `-clinical-status`, `-verification-status`, `-severity`, `-onset`, `-abatement`
- `clinicalStatus` (`active`, `recurrence`, `relapse`, `inactive`, `remission`, `resolved`) renders as `data-clinical-status`, and `clinicalStatusLabel` as text; a `clinicalStatus` without words raises a development warning
- `verificationStatus` (`unconfirmed`, `provisional`, `differential`, `confirmed`, `refuted`, `entered-in-error`) renders as `data-verification-status`, and `verificationStatusLabel` as text; a `verificationStatus` without words raises a development warning
- `-onset`, `-abatement` are each a `<time datetime>`, shown only when its label is given
- The condition is never truncated

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `condition`: string (required) — the problem or condition; never truncated
- `clinicalStatus`: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved" (optional) — FHIR Condition clinicalStatus; rendered as `data-clinical-status`
- `clinicalStatusLabel`: string (optional; required when `clinicalStatus` is set) — the clinicalStatus in words
- `verificationStatus`: "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as `data-verification-status`
- `verificationStatusLabel`: string (optional; required when `verificationStatus` is set) — the verificationStatus in words
- `severityLabel`: string (optional) — the severity in words
- `onset`: string (optional) — when it began, for <time datetime>
- `onsetLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `abatement`: string (optional) — when it resolved, for <time datetime>
- `abatementLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <li> with class="problem-record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .problem-record-list-item in css-style-sheet-template.css
- FHIR Condition: https://hl7.org/fhir/R4/condition.html
- Spec: spec/healthcare-ui/index.md
