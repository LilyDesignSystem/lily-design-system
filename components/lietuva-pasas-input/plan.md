# LietuvaPasasInput plan

- Implement the input component for Lithuania's Pasas following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 8-digit passport or identity card number.
- Companion component: `lietuva-pasas-view`.
