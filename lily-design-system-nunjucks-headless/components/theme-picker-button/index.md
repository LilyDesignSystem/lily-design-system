# ThemeSelectButton

A picker button for selecting a visual theme.

## Canonical documentation

See [components/theme-select-button/index.md](../../../components/theme-select-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/theme-select-button/macro.njk" import themePickerButton %}

{{ themePickerButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
