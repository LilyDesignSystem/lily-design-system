# PortugalPassaporteView plan

- Implement the view component for Portugal's Passaporte following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 1 letter [A-Z] and 6 digits [0-9].
- Companion component: `portugal-passaporte-input`.
