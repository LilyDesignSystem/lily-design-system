# ToolBar

A horizontal bar of tool actions.

## Canonical documentation

See [components/tool-bar/index.md](../../../components/tool-bar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tool-bar/macro.njk" import toolBar %}

{{ toolBar({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
