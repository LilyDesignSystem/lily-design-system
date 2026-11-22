# International Patient Summary

An International Patient Summary (IPS) is "a minimal and non-exhaustive patient summary dataset, specialty-agnostic,
condition-independent, but readily usable by clinicians for the cross-border unscheduled care of a patient" (HL7 FHIR IPS,
ISO 27269). `InternationalPatientSummary` lays one out for a clinician: the patient banner, a contents navigation, the
sections in the document's order, and the document's details. It is structure only: Lily parses no FHIR. Your app reads the
document and renders each section's entries with the record lists; this component holds them together and makes sure a
required section is never silently missing.

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders an `<article>` named by `label`, holding the banner, the contents `<nav>`, the sections and the document details, each
  in its own part (`-banner`, `-contents`, `-sections`, `-details`)
- Takes `sections` as plain data (`key`, `heading`, `status`, `id`) in the document's order; the contents navigation is built from it
- The IPS requires three sections: medication summary, allergies and intolerances, problem list. For each one `sections` lacks,
  the component adds an `international-patient-summary-section` with `status="omitted"`, your heading from `requiredHeadings`
  and your `omittedLabel` ("Section missing from document"), after the given sections, with a contents link to it
- Section ids default to `international-patient-summary-{key}`, on both the link and the section, so they agree without wiring
- The registry of the sixteen IPS 2.0.1 sections, with their LOINC codes and levels, is exported as `IPS_SECTIONS` (with
  `ipsContents`, `ipsMissingRequired`, `ipsSectionCode`) by the TypeScript catalogs

## Props

- `label`: string (required) -- the article's accessible name
- `sections`: `{ key, heading, status?, id? }[]` (default: `[]`) -- the sections you render, in document order
- `requiredHeadings`: `{ medications, allergies, problems }` (required) -- headings for an added, missing required section. A missing required section with no heading here throws an `IpsSectionsError` (a `RangeError`, reason `heading`), never an empty heading
- `omittedLabel`: string (required) -- the words an added section shows
- `contentsLabel`: string (optional) -- names the contents navigation; without it there is none
- `headingLevel`: 2 to 6 (default: 2) -- the heading level of an added section
- `idPrefix`: string (default: "international-patient-summary") -- section ids are `{idPrefix}-{key}`; give each summary on a page its own, and pass the same to its sections
- `banner`: slot (optional) -- the patient banner
- `details`: slot (optional) -- the document's details (title, date, authors, custodian, IPS version)
- `children`: slot (optional) -- the `InternationalPatientSummarySection` elements
- `...restProps`: any additional HTML attributes spread onto the article

## Usage

```svelte
<InternationalPatientSummary
  label="Patient summary"
  contentsLabel="Contents"
  omittedLabel="Section missing from document"
  requiredHeadings={{
    medications: "Medication summary",
    allergies: "Allergies and intolerances",
    problems: "Problem list",
  }}
  sections={[
    { key: "allergies", heading: "Allergies and intolerances" },
    { key: "problems", heading: "Problem list", status: "none-known" },
  ]}
>
  <InternationalPatientSummarySection
    section="allergies"
    heading="Allergies and intolerances"
  >
    <AllergyRecordList
      status="known"
      statusLabel="Allergies"
    >
      <AllergyRecordListItem
        substance="Penicillin"
        criticality="high"
        criticalityLabel="High risk"
      />
    </AllergyRecordList>
  </InternationalPatientSummarySection>
  <InternationalPatientSummarySection
    section="problems"
    heading="Problem list"
    status="none-known"
    statusLabel="No known problems"
  />
</InternationalPatientSummary>
```

The medication summary is missing from the document, so the component adds it, after the problem list:

```html
<section
  class="international-patient-summary-section"
  id="international-patient-summary-medications"
  aria-labelledby="international-patient-summary-medications-heading"
  data-section="medications"
  data-code="10160-0"
  data-status="omitted"
  data-required="true"
>
  <h2
    id="international-patient-summary-medications-heading"
    class="international-patient-summary-section-heading"
  >
    Medication summary
  </h2>
  <p class="international-patient-summary-section-status">Section missing from document</p>
</section>
```

## Keyboard Interactions

- None of its own. Tab reaches the contents links and each narrative's summary; Enter follows a link and Enter or Space opens a
  narrative (native behaviour)

## ARIA

- `<article aria-label>`: a self-contained document, named
- `<nav aria-label>`: the contents
- Each section is a region named by its heading, so a screen reader can list and jump to them
- Every status is words, never colour alone

## When to Use

- Use to show a patient summary received from another service or country, such as an IPS from a FHIR server or a SMART Health Link.
- Use when a clinician needs the required sections (medications, allergies, problems) every time, even when the document lacks one.
- Use for any summary built on the IPS section model, with your own section renderers inside.

## When Not to Use

- Do not use for one list on its own -- use [AllergyRecordList](../allergy-record-list/) or another record list directly.
- Do not use for the patient identity strip alone -- use the patient banner pattern on [MedicalBanner](../medical-banner/).
- Do not use for an editable record -- this is a read-only view; use [Form](../form/) and its fields.
- Do not use for a non-clinical document -- use [ArticleLayout](../article-layout/) with headings and [ContentsNav](../contents-nav/).

## Headless

The component renders the structure, the contents links and the added omitted sections. It reads no FHIR, makes no clinical
decision and ships no words: every heading and status is yours, and the narrative is yours to sanitise.

## Styles

The consumer provides all CSS styling. Class hooks: `.international-patient-summary` and its `-banner`, `-contents`, `-sections`
and `-details` parts; each contents `li` has `data-section` and `data-status`. No default styles are included.

## Testing

- Verify an `<article>` named by `label`
- Verify a missing required section is added with `data-status="omitted"`, the given heading and `omittedLabel`
- Verify the contents follow the given order, then the added sections, and link to the section ids
- Verify the banner comes first and the details last

## Advice

- **Clinicians and designers**: Keep the danger box (high-criticality allergies, active alerts) in the banner, never behind a
  collapsed control.
- **Developers**: Pass `sections` from the same data you render, so the contents and the sections cannot disagree. Sanitise the
  author's narrative before you render it. Say in your footer that the viewer is not a medical device, if that is so.

## Related components

- `international-patient-summary-section` — one section, with its LOINC code and status
- `allergy-record-list`, `medication-record-list`, `problem-record-list`, `immunization-record-list`, `procedure-record-list`,
  `device-record-list`, `record-list` — the sections' entries
- `observation-view` — results and vital signs in a `data-table`
- `medical-banner` — the patient banner

## Known limitations

None known.

## References

- IPS Implementation Guide (HL7 FHIR, 2.0.1): https://hl7.org/fhir/uv/ips/
- ISO 27269:2025 Health informatics — International patient summary

---

Lily™ and Lily Design System™ are trademarks.
