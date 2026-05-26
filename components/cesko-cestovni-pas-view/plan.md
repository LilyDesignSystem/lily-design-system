# CeskoCestovniPasView plan

- Implement the view component for Czech Republic's Cestovní pas following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: usually 8 digits, sometimes longer, issued by the Ministry of the Interior.
- Companion component: `cesko-cestovni-pas-input`.
