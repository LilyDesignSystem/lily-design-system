# ToolBarButton

One action button in a tool bar.

## Canonical documentation

See [components/tool-bar-button/index.md](../../../components/tool-bar-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tool-bar-button/macro.njk" import toolBarButton %}

{{ toolBarButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
