# ContextMenu

A menu that appears on right-click or long-press.

## Canonical documentation

See [components/context-menu/index.md](../../../components/context-menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/context-menu/macro.njk" import contextMenu %}

{{ contextMenu({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
