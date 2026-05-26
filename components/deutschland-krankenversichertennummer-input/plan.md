# DeutschlandKrankenversichertennummerInput plan

- Implement the input component for Germany's Krankenversichertennummer following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: a random capital letter followed by eight random digits and a Luhn check digit.
- Companion component: `deutschland-krankenversichertennummer-view`.
