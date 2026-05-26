# NederlandIdentiteitskaartNummerView plan

- Implement the view component for Netherlands's Identiteitskaart Nummer following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 9 characters following the same format as the passport number; 'O' is disallowed but '0' is permitted.
- Companion component: `nederland-identiteitskaart-nummer-input`.
