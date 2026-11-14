# Problem Record List Item

ProblemRecordListItem is one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution. It renders as a `<li>`. Every word is the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<li class="problem-record-list-item">` with parts `-condition`, `-clinical-status`, `-verification-status`, `-severity`, `-onset`, `-abatement`
- `clinicalStatus` (`active`, `recurrence`, `relapse`, `inactive`, `remission`, `resolved`) renders as `data-clinical-status`, and `clinicalStatusLabel` as text; a `clinicalStatus` without words raises a development warning
- `verificationStatus` (`unconfirmed`, `provisional`, `differential`, `confirmed`, `refuted`, `entered-in-error`) renders as `data-verification-status`, and `verificationStatusLabel` as text; a `verificationStatus` without words raises a development warning
- `-onset`, `-abatement` are each a `<time datetime>`, shown only when its label is given
- The condition is never truncated

## Props

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

## Usage

```html
<ProblemRecordListItem
  condition="Type 2 diabetes"
  clinicalStatus="active"
  clinicalStatusLabel="Active"
  verificationStatus="confirmed"
  verificationStatusLabel="Confirmed"
  severityLabel="Moderate"
  onset="2019-06-01"
  onsetLabel="Since June 2019"
  abatement="2024-01-15"
  abatementLabel="Resolved 15 Jan 2024"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No ARIA beyond the native `<li>`; every status is text, never colour alone

## When to Use

- Use inside `problem-record-list` for each entry.
- Use when the entry's statuses and dates matter to the reader.

## When Not to Use

- Do not use outside a `problem-record-list`.
- Do not use for "none known" or "not recorded" — that is the list's `status`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.problem-record-list-item` class hook, and every word.

## Styles

`.problem-record-list-item` and its parts, and `[data-clinical-status]`, `[data-verification-status]`.

## Testing

- Each part renders, each status as text and as `data-*`, dates as `<time datetime>`
- Only the given parts render
- A status without words raises a development warning

## Advice

- Take every word from your own translation, including the status words; Lily ships none.
- Map FHIR codes to these values in your code; Lily does not read FHIR resources.
- Format dates with `Intl.DateTimeFormat`, with the month as text so they cannot be read two ways.

## Related components

- `problem-record-list` — a list of a patient's problems and conditions, whose status is never blank

## References

- FHIR Condition: https://hl7.org/fhir/R4/condition.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare/index.md
- Adopter guide on the website, with translations: https://lilydesignsystem.com/patterns/healthcare/

---

Lily™ and Lily Design System™ are trademarks.
