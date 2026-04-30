# ThemeSelect

A select dropdown for choosing a theme.

## Canonical documentation

See [components/theme-select/index.md](../../../components/theme-select/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/theme-select/macro.njk" import themeSelect %}

{{ themeSelect({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
