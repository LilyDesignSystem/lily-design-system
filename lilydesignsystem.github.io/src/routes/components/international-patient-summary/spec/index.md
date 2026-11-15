# InternationalPatientSummary plan

- Part of [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md), from research into the International Patient Summary viewer (2026-11-15).
- Structure only: Lily parses no FHIR. The root takes its sections as plain data so it can add any missing required section, in words.
- Implemented in all nine headless catalogs, Svelte first; the section registry is `shared/ips-sections.ts`, ported to Blazor and Nunjucks.

# InternationalPatientSummary tasks

- [x] Implement in all nine headless catalogs
- [x] Unit tests in every catalog
- [x] Stories where the catalog has Storybook
- [x] Exercise in a composed example page: `/patient-summary` in the SvelteKit app, with axe and keyboard checks in Chromium, Firefox and WebKit (2026-11-15)
- [ ] Screen-reader sessions in the matrix
- [x] An id prefix (2026-11-15): `idPrefix` on the root and its sections, so two summaries on one page have different section ids
