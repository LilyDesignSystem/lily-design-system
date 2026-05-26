# NorgeFodselsnummerView plan

- Implement the view component for Norway's Fødselsnummer following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 11 digits where the first 6 represent the date of birth (DDMMYY).
- Companion component: `norge-fodselsnummer-input`.
