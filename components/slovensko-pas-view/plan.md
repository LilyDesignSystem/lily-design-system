# SlovenskoPasView plan

- Implement the view component for Slovakia's Pas following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
- Companion component: `slovensko-pas-input`.
