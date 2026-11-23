# AllergyRecordListItem

## Metadata

- Component: allergy-record-list-item
- PascalCase: AllergyRecordListItem
- Description: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status
- Purpose: Shows one allergy: its substance, reactions, severity and status.
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <li>
- CSS class: .allergy-record-list-item
- Interactive: no

## Key Behaviors

- Renders `<li class="allergy-record-list-item">` with parts `-substance`, `-reaction`, `-severity`, `-criticality`, `-clinical-status`, `-verification-status`, `-type`, `-category`, `-updated`
- `severity` (`mild`, `moderate`, `severe`) renders as `data-severity`, and `severityLabel` as text; a `severity` without words raises a development warning
- `criticality` (`low`, `high`, `unable-to-assess`) renders as `data-criticality`, and `criticalityLabel` as text; a `criticality` without words raises a development warning
- `clinicalStatus` (`active`, `inactive`, `resolved`) renders as `data-clinical-status`, and `clinicalStatusLabel` as text; a `clinicalStatus` without words raises a development warning
- `verificationStatus` (`unconfirmed`, `presumed`, `confirmed`, `refuted`, `entered-in-error`) renders as `data-verification-status`, and `verificationStatusLabel` as text; a `verificationStatus` without words raises a development warning
- `-updated` is a `<time datetime>`, shown only when its label is given
- The substance is never truncated

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## Keyboard

- Not interactive

## Props

- `subjectLabel`: string (optional) -- whose record it is, when it is not the patient's ("Mother", "Fetus 1"); rendered first as `-subject`, so a relative's history is never read as the patient's
- `substance`: string (required) — what the patient reacts to; never truncated
- `reaction`: string (optional) — the manifestation
- `severity`: "mild" | "moderate" | "severe" (optional) — the reaction's severity (FHIR reaction.severity); rendered as `data-severity`
- `severityLabel`: string (optional; required when `severity` is set) — the severity in words
- `criticality`: "low" | "high" | "unable-to-assess" (optional) — the risk of a future reaction (FHIR criticality), not the severity of a past one; rendered as `data-criticality`
- `criticalityLabel`: string (optional; required when `criticality` is set) — the criticality in words
- `clinicalStatus`: "active" | "inactive" | "resolved" (optional) — FHIR clinicalStatus; rendered as `data-clinical-status`
- `clinicalStatusLabel`: string (optional; required when `clinicalStatus` is set) — the clinicalStatus in words
- `verificationStatus`: "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error" (optional) — FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one; rendered as `data-verification-status`
- `verificationStatusLabel`: string (optional; required when `verificationStatus` is set) — the verificationStatus in words
- `typeLabel`: string (optional) — allergy or intolerance, in words (FHIR type)
- `categoryLabel`: string (optional) — food, medication, environment or biologic, in words (FHIR category)
- `updated`: string (optional) — when the record was last updated
- `updatedLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `children`: slot (optional) — anything else, such as a link to the full record
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). The rules are `AllergyRules` in `LilyCore` and `lily-core`, one test each.

- Apple: `AllergyRecordListItem(_:codes:extra:)` in `LilyUI`: the record is one element speaking `AllergyRules.spoken` (whose record, substance, reaction, severity, criticality, clinical and verification status, type, category, updated), the substance never truncated; extra content is its own element; a code without its words warns. Style: `AllergyRecordListItemStyle`, which gets the codes for colour.
- Android: `AllergyRecordListItem(words, codes, extra)` in `lily-compose`: the record is one TalkBack stop in the same order; extra content follows as its own stops.

## Acceptance Criteria

- [x] Renders <li> with class="allergy-record-list-item"
- [x] Each part renders, each status as text and as data
- [x] Only the given parts render
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .allergy-record-list-item in css-style-sheet-template.css
- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
