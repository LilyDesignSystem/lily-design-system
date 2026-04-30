# Drawer

A panel that slides in from the edge of the screen.

## Canonical documentation

See [components/drawer/index.md](../../../components/drawer/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/drawer/macro.njk" import drawer %}

{{ drawer({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
