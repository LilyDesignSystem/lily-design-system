# TreeMenu

A hierarchical tree menu with expandable branches.

## Canonical documentation

See [components/tree-menu/index.md](../../../components/tree-menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tree-menu/macro.njk" import treeMenu %}

{{ treeMenu({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
