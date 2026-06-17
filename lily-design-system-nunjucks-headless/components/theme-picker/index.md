# ThemeSelect

A picker for selecting a visual theme.

## Canonical documentation

See [components/theme-select/index.md](../../../components/theme-select/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/theme-select/macro.njk" import themePicker %}

{{ themePicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
