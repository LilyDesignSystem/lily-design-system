# InternationalPatientSummarySection

One section of an International Patient Summary: a `<section>` named by its heading, carrying its key, LOINC code, status and required flag as data.

A Blazor component that renders `<section>`.

See `components/international-patient-summary-section/index.md` for the canonical documentation.

## Props

- `Section`: string (required) — the IPS section key, such as `allergies`; `data-section`
- `Heading`: string (required) — the heading, the consumer's words
- `HeadingLevel`: 2 to 6 (default 2)
- `Status`: `"known" | "none-known" | "not-recorded" | "unavailable" | "omitted"` (default `"known"`); `data-status`
- `StatusLabel`: string — the status in words; required for any status but `known`
- `Code`: string (optional) — the LOINC code; default the IPS code for the key; `data-code`
- `Required`: boolean (optional) — default whether the IPS requires the section; `data-required`
- `Id`: string (optional) — default `international-patient-summary-{section}`
- `Narrative`: RenderFragment (optional), with `NarrativeLabel` and `NarrativeOpen` — the author's narrative in a `<details>`
- `ChildContent`: RenderFragment (optional) — the section's entries

---

Lily™ and Lily Design System™ are trademarks.
