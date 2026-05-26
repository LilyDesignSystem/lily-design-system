# RomaniaCodNumericPersonalInput plan

- Implement the input component for Romania's Cod Numeric Personal following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.
- Companion component: `romania-cod-numeric-personal-view`.
