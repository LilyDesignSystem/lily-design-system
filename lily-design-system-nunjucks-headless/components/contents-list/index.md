# ContentsList

An contents ordered list of contents list item components.

## Canonical documentation

See [components/contents-list/index.md](../../../components/contents-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/contents-list/macro.njk" import contentsList %}

{{ contentsList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
