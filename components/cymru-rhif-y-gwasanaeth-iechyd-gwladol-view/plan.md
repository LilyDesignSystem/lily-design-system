# CymruRhifYGwasanaethIechydGwladolView plan

- Implement the view component for Wales's Rhif y Gwasanaeth Iechyd Gwladol following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).
- Companion component: `cymru-rhif-y-gwasanaeth-iechyd-gwladol-input`.
