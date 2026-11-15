# International Patient Summary Section

One section of an [International Patient Summary](../international-patient-summary/): a `<section>` named by its heading,
carrying the section's key, its LOINC code, its status and whether the IPS requires it. The entries are yours, usually a
record list; the status is never blank; the document author's narrative can follow in a disclosure.

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<section id aria-labelledby>` with an `hN` heading (`headingLevel`, default 2)
- `data-section` (the key), `data-code` (the LOINC code, from the IPS registry unless given), `data-status` (default `known`) and
  `data-required="true"` for the medication summary, allergies and problem list
- For any status but `known`, `statusLabel` is shown under the heading
- The narrative, when given, follows the entries in a `<details>`, open when `narrativeOpen`
- `id` defaults to `international-patient-summary-{section}`, the id the root's contents link to

## Props

- `section`: string (required) -- the IPS section key: `medications`, `allergies`, `problems`, `immunizations`, `results`,
  `procedures`, `devices`, `vital-signs`, `past-illness`, `functional-status`, `plan-of-care`, `social-history`, `pregnancy`,
  `advance-directives`, `alerts`, `patient-story`, or your own
- `heading`: string (required) -- the heading
- `headingLevel`: 2 to 6 (default: 2)
- `status`: `known` | `none-known` | `not-recorded` | `unavailable` | `omitted` (default: `known`)
- `statusLabel`: string -- the status in words; required for any status but `known`
- `code`: string (optional) -- the LOINC code
- `required`: boolean (optional) -- override whether the IPS requires the section
- `id`: string (optional) -- the element id
- `narrative`: slot (optional), `narrativeLabel`: string, `narrativeOpen`: boolean (default: false) -- the author's narrative
- `children`: slot (optional) -- the entries
- `...restProps`: any additional HTML attributes spread onto the section

## Usage

```svelte
<InternationalPatientSummarySection
  section="problems"
  heading="Problem list"
  status="not-recorded"
  statusLabel="Not recorded"
>
  {#snippet narrative()}<p>No problems were recorded at discharge.</p>{/snippet}
</InternationalPatientSummarySection>
```

## Keyboard Interactions

- None of its own: the narrative's summary is native (Tab, then Enter or Space)

## ARIA

- A `<section>` named by its heading: a region landmark
- The status is text, never colour alone

## When to Use

- Use inside an `InternationalPatientSummary`, one per section of the document.
- Use when a section's emptiness must be told apart: none known, not recorded, unavailable, or missing from the document.
- Use to show the author's narrative beside the structured entries.

## When Not to Use

- Do not use outside a patient summary -- use a plain `<section>` with a heading, or [Card](../card/).
- Do not use to say a list is empty -- the record lists carry their own status; use the section status for the section.

## Headless

It renders the section's structure, data attributes and status words. Your entries and narrative are rendered as given.

## Styles

Class hooks: `.international-patient-summary-section` and its `-heading`, `-status` and `-narrative` parts. Style a missing
section with `[data-status="omitted"]` and a required one with `[data-required]`; always with the words, never instead of them.

## Testing

- Verify a `<section>` named by its heading, with `data-section`, `data-code`, `data-status` and `data-required`
- Verify the status words for every status but `known`
- Verify the narrative's `<details>` and its `open` state

## Advice

- **Developers**: Open the narrative when a section has a narrative but no structured entries, so nothing is hidden.

## Related components

- `international-patient-summary` — the whole summary
- `allergy-record-list` and the other record lists — the entries

## References

- IPS Composition sections: https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html

---

Lily™ and Lily Design System™ are trademarks.
