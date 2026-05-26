# HrvatskaOsobniIdentifikacijskiBrojInput plan

- Implement the input component for Croatia's Osobni identifikacijski broj following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 11 digits — 10 random digits plus a check digit; permanent, unique, and assigned to every Croatian citizen and legal person.
- Companion component: `hrvatska-osobni-identifikacijski-broj-view`.
