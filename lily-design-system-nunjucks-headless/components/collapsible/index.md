# Collapsible

A container that can be expanded or collapsed.

## Canonical documentation

See [components/collapsible/index.md](../../../components/collapsible/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/collapsible/macro.njk" import collapsible %}

{{ collapsible({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
