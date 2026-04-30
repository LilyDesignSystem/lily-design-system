# SummaryListItem

One key-value pair in a summary list.

## Canonical documentation

See [components/summary-list-item/index.md](../../../components/summary-list-item/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/summary-list-item/macro.njk" import summaryListItem %}

{{ summaryListItem({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
