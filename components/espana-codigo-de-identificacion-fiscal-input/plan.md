# EspanaCodigoDeIdentificacionFiscalInput plan

- Implement the input component for Spain's Código de Identificación Fiscal following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 9 characters: 8 numbers and a control letter (the letters I, Ñ, O, and U are not used).
- Companion component: `espana-codigo-de-identificacion-fiscal-view`.
