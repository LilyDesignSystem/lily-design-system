# InternationalPatientSummarySection

## Metadata

- Component: international-patient-summary-section
- PascalCase: InternationalPatientSummarySection
- Description: one section of an International Patient Summary, with its LOINC code and a status that is never blank
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <section>
- Naming exception: `-section` is not in the suffix table; it renders `<section>`, the element its name says
- CSS class: .international-patient-summary-section
- Interactive: no

## Composition

- Pattern: Document/Section
- Parent: international-patient-summary
- Children: the consumer's entries, usually a record list (`allergy-record-list`, `medication-record-list`, …) or a `data-table` of `observation-view`

## Key Behaviors

- Renders `<section class="international-patient-summary-section" id aria-labelledby>` with a heading `hN.international-patient-summary-section-heading` (`headingLevel`, default 2)
- `data-section` is the IPS section key; `data-code` its LOINC code (from the registry unless `code` is given); `data-status` its status (default `known`); `data-required="true"` when the IPS requires it (unless `required` is given)
- For any status but `known`, `statusLabel` is shown under the heading as `p.international-patient-summary-section-status`, so the section is never blank
- The entries are the consumer's children
- When `narrative` is given, it follows the entries in `details.international-patient-summary-section-narrative` with `narrativeLabel` as its summary, open when `narrativeOpen`. The narrative is the document author's HTML: the consumer sanitises it
- `id` defaults to `international-patient-summary-{section}`, the id the root's contents link to
- A missing `heading`, a status other than `known` without `statusLabel`, or a narrative without `narrativeLabel` raises a development warning (Svelte, React, Vue, Angular)

## ARIA

- `<section>` named by its heading through `aria-labelledby`: a region landmark
- The status is text, never colour alone

## Keyboard

- None of its own: the narrative's `<details>` is native

## Props

- `section`: string (required) -- the IPS section key, such as `allergies`
- `heading`: string (required) -- the heading, the consumer's words
- `headingLevel`: 2 to 6 (default: 2)
- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" (default: "known")
- `statusLabel`: string -- the status in words; required for any status but `known`
- `code`: string (optional) -- the LOINC code; default the IPS code for the key
- `required`: boolean (optional) -- default whether the IPS requires the section
- `id`: string (optional) -- default `international-patient-summary-{section}`
- `idPrefix`: string (default: "international-patient-summary") -- the same as its summary's; the default `id` is `{idPrefix}-{section}`
- `narrative`: slot (optional) -- the author's narrative
- `narrativeLabel`: string -- the narrative's summary; required with `narrative`
- `narrativeOpen`: boolean (default: false) -- open the narrative, as when the section has no structured entries
- `children`: slot (optional) -- the entries
- `...restProps`: any additional HTML attributes spread onto the section

## Native platform

- Decision: native
- Uses: <details>/<summary> for the author's narrative
- Could use: name attribute
- Notes: The narrative is a <details>: open, close, keyboard and find-in-page reveal come from the browser.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <section> with class="international-patient-summary-section", named by its heading
- [ ] data-section, data-code, data-status and data-required
- [ ] Status words for any status but known
- [ ] Narrative in a details
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .international-patient-summary-section in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/international-patient-summary-section.html
- IPS Composition sections: https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html
