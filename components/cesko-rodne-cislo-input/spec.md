# CeskoRodneCisloInput plan

- Implement the input component for Czech Republic's Rodné číslo following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: nine or ten digits in the format YYXXDD/SSSC where XX=MM for males and MM+50 for females; the ten-digit form ends in a check digit and is usually divisible by 11.
- Companion component: `cesko-rodne-cislo-view`.

# CeskoRodneCisloInput tasks

- [ ] Add component to all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks)
- [ ] Add demo registry entries in all 6 example subprojects (HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js, Blazor Web, Nunjucks Eleventy)
- [ ] Add per-framework unit tests
- [ ] Add Storybook stories where applicable
- [ ] Verify WCAG 2.2 AAA compliance
- [ ] Document any country-specific validation rules
