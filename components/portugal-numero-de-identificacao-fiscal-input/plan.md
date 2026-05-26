# PortugalNumeroDeIdentificacaoFiscalInput plan

- Implement the input component for Portugal's Número de Identificação Fiscal following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-input` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 9 digits; the leading digit(s) encode the kind of taxpayer (1-3 personal, 45 non-resident citizen, 5 legal person, etc.).
- Companion component: `portugal-numero-de-identificacao-fiscal-view`.
