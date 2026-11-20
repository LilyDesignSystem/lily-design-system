# RecordProvenanceView

## Metadata

- Component: record-provenance-view
- PascalCase: RecordProvenanceView
- Description: who recorded a record, where it came from and whether it is signed, in the consumer's words
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .record-provenance-view
- Interactive: no

## Key Behaviors

- Renders `<span class="record-provenance-view">` with one part per fact given: `-attestation`, `-sync`, `-source`, `-author`, `-observed`, `-recorded`, `-version`, in that order, so the signature and sync states come first
- `attestation`, `sync` and `source` are `data-*` attributes for CSS and words for people; a state without words raises a development warning, so an unsigned, amended or unsent record never reads as a signed one
- Times are `<time datetime>`; observed-at and recorded-at are separate, so a document's date is never read as the observation's
- A part with no words is left out; it decides nothing

## ARIA

- No role and no `aria-label`; `label` renders as hidden text

## Keyboard

- Not interactive

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

## Acceptance Criteria

- [x] Renders <span> with class="record-provenance-view"
- [x] The parts render in order, states first, each in the consumer's words
- [x] An unsigned record renders its state and words; a state without words warns
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .record-provenance-view in css-style-sheet-template.css
- openEHR AUDIT_DETAILS, ATTESTATION, FEEDER_AUDIT: https://specifications.openehr.org/releases/RM/latest/common.html
- FHIR Provenance: https://hl7.org/fhir/provenance.html
- Spec: spec/lessons/openehr/index.md, spec/lessons/zoblocks/index.md, spec/lessons/openmrs/index.md
