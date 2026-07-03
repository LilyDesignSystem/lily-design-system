# BelgiqueNumeroDeRegistreNationalView plan

- Implement the view component for Belgium's Numéro de Registre National / Rijksregisternummer following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 11 digits where the first 6 are the date of birth (YYMMDD), the next 3 are an ordering number (uneven for men, even for women) and the last 2 a check digit.
- Companion component: `belgique-numero-de-registre-national-input`.

# BelgiqueNumeroDeRegistreNationalView tasks

- [ ] Add component to all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks)
- [ ] Add demo registry entries in all 6 example subprojects (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Blazor Web, Nunjucks Eleventy)
- [ ] Add per-framework unit tests
- [ ] Add Storybook stories where applicable
- [ ] Verify WCAG 2.2 AAA compliance
- [ ] Document any country-specific validation rules
