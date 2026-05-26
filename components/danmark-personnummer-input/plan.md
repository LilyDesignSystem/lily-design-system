# DanmarkPersonnummerInput plan

- Implement the input component for Denmark's Personnummer (CPR-nummer) following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).
- Companion component: `danmark-personnummer-view`.
