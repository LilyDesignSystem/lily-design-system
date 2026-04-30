# ToggleButton

A button that toggles between pressed and unpressed states.

## Canonical documentation

See [components/toggle-button/index.md](../../../components/toggle-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/toggle-button/macro.njk" import toggleButton %}

{{ toggleButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
