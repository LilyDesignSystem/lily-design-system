# TreeLink

One link in the tree.

## Canonical documentation

See [components/tree-link/index.md](../../../components/tree-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tree-link/macro.njk" import treeLink %}

{{ treeLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
