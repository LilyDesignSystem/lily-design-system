# ThemePicker

A picker for selecting a visual theme.

## Canonical documentation

See [components/theme-picker/index.md](../../../components/theme-picker/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/theme-picker/macro.njk" import themePicker %}

{{ themePicker({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
