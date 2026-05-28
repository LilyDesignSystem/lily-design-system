# SlovenskoPasInput plan

- Implement the input component for Slovakia's Pas following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
- Companion component: `slovensko-pas-view`.

# SlovenskoPasInput tasks

- [ ] Add component to all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks)
- [ ] Add demo registry entries in all 6 example subprojects (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Blazor Web, Nunjucks Eleventy)
- [ ] Add per-framework unit tests
- [ ] Add Storybook stories where applicable
- [ ] Verify WCAG 2.2 AAA compliance
- [ ] Document any country-specific validation rules
