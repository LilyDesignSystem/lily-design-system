# TreeList

A hierarchical list with nested expandable items.

## Canonical documentation

See [components/tree-list/index.md](../../../components/tree-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tree-list/macro.njk" import treeList %}

{{ treeList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
