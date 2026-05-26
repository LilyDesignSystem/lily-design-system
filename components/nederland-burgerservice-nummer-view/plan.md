# NederlandBurgerserviceNummerView plan

- Implement the view component for Netherlands's Burgerservicenummer following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 9-digit number issued via the Personal Records Database (BRP); validated with a variant of the eleven-test (Luhn) algorithm.
- Companion component: `nederland-burgerservice-nummer-input`.
