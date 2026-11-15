# InternationalPatientSummary plan

- Part of [spec/healthcare-ui](../../../spec/healthcare-ui/index.md), from research into the International Patient Summary viewer (2026-11-15).
- Structure only: Lily parses no FHIR. The root takes its sections as plain data so it can add any missing required section, in words.
- Implemented in all nine headless catalogs, Svelte first; the section registry is `shared/ips-sections.ts`, ported to Blazor and Nunjucks.

# InternationalPatientSummary tasks

- [x] Implement in all nine headless catalogs
- [x] Unit tests in every catalog
- [x] Stories where the catalog has Storybook
- [ ] Exercise in a composed example page (the IPS patient summary page, P27-T9)
- [ ] Screen-reader sessions in the matrix
