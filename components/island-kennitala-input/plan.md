# IslandKennitalaInput plan

- Implement the input component for Iceland's Kennitala following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 10 digits where the first 6 are the date of birth (DDMMYY).
- Companion component: `island-kennitala-view`.
