# LiechtensteinNationalIdentityCardNumberInput plan

- Implement the input component for Liechtenstein's Liechtenstein National Identity Card Number following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.
- Companion component: `liechtenstein-national-identity-card-number-view`.
