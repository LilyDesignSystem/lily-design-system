# Menu

A list of actions or options triggered by a button.

## Canonical documentation

See [components/menu/index.md](../../../components/menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/menu/macro.njk" import menu %}

{{ menu({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
