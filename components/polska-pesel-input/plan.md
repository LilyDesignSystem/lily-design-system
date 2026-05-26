# PolskaPeselInput plan

- Implement the input component for Poland's PESEL following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 11 numeric digits; assigned shortly after birth and unchanged for life.
- Companion component: `polska-pesel-view`.
