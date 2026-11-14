# Allergy Record List Item

AllergyRecordListItem is one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status. It renders as a `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="allergy-record-list-item">` with parts `-substance`, `-reaction`, `-severity`, `-criticality`, `-clinical-status`, `-verification-status`, `-type`, `-category`, `-updated`
- `severity` (`mild`, `moderate`, `severe`) renders as `data-severity`, and `severityLabel` as text; a `severity` without words raises a development warning
- `criticality` (`low`, `high`, `unable-to-assess`) renders as `data-criticality`, and `criticalityLabel` as text; a `criticality` without words raises a development warning
- `clinicalStatus` (`active`, `inactive`, `resolved`) renders as `data-clinical-status`, and `clinicalStatusLabel` as text; a `clinicalStatus` without words raises a development warning
- `verificationStatus` (`unconfirmed`, `presumed`, `confirmed`, `refuted`, `entered-in-error`) renders as `data-verification-status`, and `verificationStatusLabel` as text; a `verificationStatus` without words raises a development warning
- `-updated` is a `<time datetime>`, shown only when its label is given
- The substance is never truncated

## Props

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

## Usage

```html
<AllergyRecordListItem
  substance="Penicillin"
  reaction="Anaphylaxis"
  severity="severe"
  severityLabel="Severe"
  criticality="high"
  criticalityLabel="High risk"
  clinicalStatus="active"
  clinicalStatusLabel="Active"
  verificationStatus="confirmed"
  verificationStatusLabel="Confirmed"
  typeLabel="Allergy"
  categoryLabel="Medication"
  updated="2026-11-03"
  updatedLabel="Updated 3 Nov 2026"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## When to Use

- Use inside `allergy-record-list` for each entry.
- Use when the entry's statuses and dates matter to the reader.

## When Not to Use

- Do not use outside a `allergy-record-list`.
- Do not use for "none known" or "not recorded" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.allergy-record-list-item` class hook, and every word.

## Styles

`.allergy-record-list-item` and its parts, and `[data-severity]`, `[data-criticality]`, `[data-clinical-status]`, `[data-verification-status]`.

## Testing

- Each part renders, each status as text and as `data-*`, dates as `<time datetime>`
- Only the given parts render
- A status without words raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `allergy-record-list` — a list of a patient's allergies and intolerances, whose status is never blank

## References

- FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
