# ItaliaCodiceFiscaleInput plan

- Implement the input component for Italy's Codice fiscale following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 16 alphanumeric characters: 3 from the surname, 3 from the given name, 5 encoding date of birth and sex, 4 encoding place of birth, and 1 check character.
- Companion component: `italia-codice-fiscale-view`.
