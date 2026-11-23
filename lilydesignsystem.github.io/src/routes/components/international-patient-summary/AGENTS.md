# InternationalPatientSummary

## Metadata

- Component: international-patient-summary
- PascalCase: InternationalPatientSummary
- Description: an International Patient Summary (HL7 FHIR IPS) laid out for a clinician: patient banner, contents, sections and document details, never silently missing a required section
- Purpose: Presents the minimum clinical summary of a patient in a standard shape that any country's clinicians can read.
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <article>
- Naming exception: no suffix; the root of a document view is an `<article>`, a self-contained composition
- CSS class: .international-patient-summary
- Interactive: no

## Composition

- Pattern: Document/Section
- Children: international-patient-summary-section
- Slots: banner (the patient banner pattern), details (the document's details)

## Key Behaviors

- Renders `<article class="international-patient-summary" aria-label={label}>` holding, in order: `div.international-patient-summary-banner` (when given), `nav.international-patient-summary-contents` (when `contentsLabel` is given), `div.international-patient-summary-sections`, `div.international-patient-summary-details` (when given)
- Structure only: Lily parses no FHIR. The consumer reads the document and renders each section's entries with the record lists
- Takes `sections`, the sections it is given as plain data (`key`, `heading`, `status`, `id`), in document order
- For each of the three sections the IPS requires (`medications`, `allergies`, `problems`) that `sections` lacks, adds an `international-patient-summary-section` with `status="omitted"`, the consumer's `requiredHeadings[key]` and `omittedLabel`, after the given sections, in registry order. A missing required section is never silently absent
- The contents navigation is an `<ol>` of links to each section's id (`international-patient-summary-{key}` unless given), with `data-section` and `data-status` on each `li`, in the same order, the added sections last
- The section registry (16 keys, LOINC codes, levels) and the adding rule are `ips-sections` in the TypeScript catalogs, ported to Blazor and Nunjucks
- A missing `label`, `omittedLabel` or `requiredHeadings` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- `<article>` named by `aria-label` — a self-contained document
- `<nav aria-label={contentsLabel}>` — the contents
- Each section is a `<section>` named by its heading (`aria-labelledby`), so it is a region landmark a screen reader can list

## Keyboard

- None of its own: links and the narrative's `<details>` are native

## Props

- `label`: string (required) -- the article's accessible name
- `sections`: { key, heading, status?, id? }[] (default: []) -- the sections the consumer renders, in document order
- `requiredHeadings`: { medications, allergies, problems } (required) -- headings for an added, missing required section. A missing required section with no heading here throws an `IpsSectionsError` (a `RangeError`, reason `heading`; `IpsSectionsException` in Blazor), never an empty heading
- `omittedLabel`: string (required) -- the words an added section shows, such as "Section missing from document"
- `contentsLabel`: string (optional) -- names the contents navigation; without it there is none
- `headingLevel`: 2 to 6 (default: 2) -- the heading level of an added section
- `idPrefix`: string (default: "international-patient-summary") -- section ids are `{idPrefix}-{key}`; give each summary on a page its own, and pass the same to its sections
- `banner`: slot (optional) -- the patient banner composition
- `details`: slot (optional) -- the document's details
- `children`: slot (optional) -- the `international-patient-summary-section` elements
- `...restProps`: any additional HTML attributes spread onto the article

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). The rules are `IpsRules` in `LilyCore` and `lily-core`.

- Apple: `InternationalPatientSummary(label:sections:requiredHeadings:omittedLabel:contentsLabel:headingLevel:onSelectSection:banner:content:details:)` in `LilyUI`: a labelled container; the contents are buttons that call `onSelectSection` with a section key (the app scrolls, for example with `ScrollViewReader`), since mobile has no in-page links; every missing required section is added as an omitted section with the app's heading and `omittedLabel`. The registry and the adding rule are `ipsContents` in `LilyCore`, proved equal to `shared/ips-sections.ts` by its vectors.
- Android: `InternationalPatientSummary(…)` in `lily-compose`: a traversal group with the same contents callback and added sections, on `ipsContents` in `lily-core`.

## Acceptance Criteria

- [ ] Renders <article> with class="international-patient-summary" and aria-label
- [ ] Adds an omitted section, in words, for each missing required section, and a contents link to it
- [ ] Contents follow the given order, then the added sections
- [ ] No hardcoded words; no FHIR parsing
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .international-patient-summary in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/international-patient-summary.html
- IPS Implementation Guide: https://hl7.org/fhir/uv/ips/
- ISO 27269:2025 International Patient Summary
