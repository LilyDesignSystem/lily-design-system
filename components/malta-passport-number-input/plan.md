# MaltaPassportNumberInput plan

- Implement the input component for Malta's Malta Passport Number following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 7 numerical digits issued by the Civil Registration Directorate.
- Companion component: `malta-passport-number-view`.
