# SummaryList

An ordered list of key-value summary pairs.

## Canonical documentation

See [components/summary-list/index.md](../../../components/summary-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/summary-list/macro.njk" import summaryList %}

{{ summaryList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
