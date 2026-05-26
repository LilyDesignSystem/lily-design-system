# SuomiHenkilotunnusView plan

- Implement the view component for Finland's Henkilötunnus following the existing national-personal-identifier pattern (see `france-numero-d-identification-au-repertoire-view` for reference).
- Mirror the implementation across all 6 headless subprojects (Svelte, React, Vue, HTML, Blazor, Nunjucks) and all 6 example subprojects.
- Pattern validation and `inputmode` (for the input variant) follow the documented format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.
- Companion component: `suomi-henkilotunnus-input`.
