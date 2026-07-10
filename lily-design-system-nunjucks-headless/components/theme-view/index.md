# ThemeView

A read-only display of the current theme.

## Canonical documentation

See [components/theme-view/index.md](../../../components/theme-view/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/theme-view/macro.njk" import themeView %}

{{ themeView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
