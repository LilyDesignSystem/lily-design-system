# LiechtensteinPassportNumberInput plan

- Implement the input component for Liechtenstein's Liechtenstein Passport Number following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 1 letter followed by 5 digits (e.g. R00536).
- Companion component: `liechtenstein-passport-number-view`.
