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
- `statusPlacement`: `"heading"` (default) | `"list"` -- where a status other than `known` is said in words. `"list"` prints no status line under the heading and needs no `statusLabel`: the record list inside has its own never-blank status item, so the words appear once (Svelte, React, Solid, Vue, Angular, Web Components `status-placement`, Nunjucks, Blazor `StatusPlacement`; in the HTML and Alpine snippets leave the `p` out). `data-status` stays on the section either way (2026-11-22, P42-T6)
- `level`: `"required"` | `"recommended"` | `"optional"` -- the section's level in the IPS, as `data-level` beside `data-required`; default the registry's level for the key (none for a key that is not an IPS section), so a theme styles it without a consumer class (all catalogs).
- `meta` and `warning`: optional slots (a Svelte snippet, a React or Solid element prop, a Vue slot, `slot="meta"` in Web Components, `meta`/`warning` strings in Nunjucks, a Blazor `RenderFragment`), rendered in that order after the heading and status and before the entries, each in `div.international-patient-summary-section-meta` / `-warning`, and nothing at all when omitted. In Angular, project an element with a `meta` or `warning` attribute; Angular cannot tell whether anything was projected, so it has no wrapper and the element carries its own class. In the HTML and Alpine snippets the two divs are markup to keep or delete.
- `code`: string (optional) -- the LOINC code
- `required`: boolean (optional) -- override whether the IPS requires the section
- `id`: string (optional) -- the element id
- `idPrefix`: string (default: "international-patient-summary") -- the same as its summary's; the default `id` is `{idPrefix}-{section}`
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

## Known limitations

None known.

## References

- IPS Composition sections: https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html

---

Lily™ and Lily Design System™ are trademarks.
