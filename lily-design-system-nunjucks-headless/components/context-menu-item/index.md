# ContextMenuItem

One item in a context menu.

## Canonical documentation

See [components/context-menu-item/index.md](../../../components/context-menu-item/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/context-menu-item/macro.njk" import contextMenuItem %}

{{ contextMenuItem({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
