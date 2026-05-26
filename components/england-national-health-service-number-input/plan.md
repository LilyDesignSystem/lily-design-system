# EnglandNationalHealthServiceNumberInput plan

- Implement the input component for England's National Health Service Number following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 10 digits in 3-3-4 format with a Modulus-11 check digit, allocated through the Personal Demographics Service.
- Companion component: `england-national-health-service-number-view`.
