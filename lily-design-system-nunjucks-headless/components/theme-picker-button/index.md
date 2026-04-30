# ThemePickerButton

A picker button for selecting a visual theme.

## Canonical documentation

See [components/theme-picker-button/index.md](../../../components/theme-picker-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/theme-picker-button/macro.njk" import themePickerButton %}

{{ themePickerButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
