# ToggleGroup

A group of toggle buttons for selecting options.

## Canonical documentation

See [components/toggle-group/index.md](../../../components/toggle-group/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/toggle-group/macro.njk" import toggleGroup %}

{{ toggleGroup({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
