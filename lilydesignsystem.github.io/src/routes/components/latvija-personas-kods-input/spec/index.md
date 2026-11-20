# LatvijaPersonasKodsInput plan

- Implement the input component for Latvia's Personas kods following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).
- Companion component: `latvija-personas-kods-view`.

# LatvijaPersonasKodsInput tasks

- [ ] Add component to all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks)
- [ ] Add demo registry entries in all 6 example subprojects (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Blazor Web, Nunjucks Eleventy)
- [ ] Add per-framework unit tests
- [ ] Add Storybook stories where applicable
- [ ] Verify WCAG 2.2 AAA compliance
- [ ] Document any country-specific validation rules
