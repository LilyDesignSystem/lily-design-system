# MenuBar

A horizontal bar of menu triggers.

## Canonical documentation

See [components/menu-bar/index.md](../../../components/menu-bar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/menu-bar/macro.njk" import menuBar %}

{{ menuBar({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
