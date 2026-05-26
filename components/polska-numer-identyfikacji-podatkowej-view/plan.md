# PolskaNumerIdentyfikacjiPodatkowejView plan

- Implement the view component for Poland's Numer Identyfikacji Podatkowej following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 10 numeric digits used for tax identification.
- Companion component: `polska-numer-identyfikacji-podatkowej-input`.
