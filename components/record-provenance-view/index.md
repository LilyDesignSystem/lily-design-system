# Record Provenance View

RecordProvenanceView is a headless read-only display of where a record came from: who wrote it, its source, when the thing it records happened and when it was recorded, its version, and whether it is signed or still only on this device. It renders as a `<span>` of parts, each in the consumer's words, with the states as `data-*` attributes.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<span class="record-provenance-view">` with one part per fact given, signature and sync states first: `-attestation`, `-sync`, `-source`, `-author`, `-observed`, `-recorded`, `-version`
- `attestation`, `sync` and `source` render as `data-attestation`, `data-sync` and `data-source`; a state without words raises a development warning
- Observed-at and recorded-at are separate `<time>` parts, so a document's date is never read as the observation's
- A part with no words is left out

## Props

- `attestation`: "signed" | "pending" | "unsigned" | "amended" | "deleted" (optional) — whether the record is signed; rendered as `data-attestation`
- `attestationLabel`: string (required with `attestation`) — that state in words ("Awaiting signature")
- `sync`: "pending" | "failed" (optional) — "pending" is saved on this device and not yet sent, "failed" could not be sent; rendered as `data-sync`
- `syncLabel`: string (required with `sync`) — that state in words
- `source`: string (optional) — where the record came from, as the consumer's code ("clinic", "device", "patient-reported", "external", "extracted"); rendered as `data-source`
- `sourceLabel`: string (optional) — that source in words ("From a blood pressure monitor")
- `authorLabel`: string (optional) — who wrote or recorded it ("Dr A Patel")
- `observed`, `observedLabel`: string (optional) — when the thing recorded happened (ISO 8601, as `datetime`) and the consumer's words for it
- `recorded`, `recordedLabel`: string (optional) — when it was recorded, the same way
- `versionLabel`: string (optional) — the version in words ("Version 3")
- `label`: string (optional) — hidden text naming the provenance
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<RecordProvenanceView
  attestation="pending"
  attestationLabel="Awaiting signature"
  source="device"
  sourceLabel="From a blood pressure monitor"
  authorLabel="Dr A Patel"
  recorded="2026-11-03T09:00"
  recordedLabel="Recorded 09:00"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No role and no `aria-label`; `label` renders as hidden text

## When to Use

- Use beside a note, result or record whose signature state matters: a draft, a note awaiting a countersignature, an amended entry.
- Use for imported, device or patient-reported values, so a reader knows where they came from.
- Use in offline-capable apps for work saved on the device and not yet sent.

## When Not to Use

- Do not use for a record's review date alone — use `review-date`.
- Do not use for a list of versions — use `timeline-list` with a `diff`.
- Do not use for a person's identity — use the patient banner composition.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.record-provenance-view` class hook and its parts, and every word and every state.

## Styles

`.record-provenance-view`, its parts, and `[data-attestation]`, `[data-sync]`, `[data-source]`.

## Testing

- The parts render in order, states first, each in the consumer's words
- An unsigned record shows its own state and words
- A state without words warns in development

## Advice

- Say plainly what is not yet true: "Awaiting signature", "Not sent: saved on this device".
- Keep the observed and recorded times apart; a value entered today about last week is last week's value.
- Mark machine-extracted values as such (`source="extracted"`) until a person has reviewed them.

## Related components

- `review-date` — when a record was last reviewed
- `timeline-list` — a sequence of events, such as a record's versions
- `record-list-item` — one record in a record list

## References

- openEHR AUDIT_DETAILS, ATTESTATION, FEEDER_AUDIT: https://specifications.openehr.org/releases/RM/latest/common.html
- FHIR Provenance: https://hl7.org/fhir/provenance.html
- Spec: spec/lessons/openehr/index.md

---

Lily™ and Lily Design System™ are trademarks.
