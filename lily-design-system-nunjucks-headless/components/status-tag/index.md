# StatusTag

A tag showing the current status of a task.

## Canonical documentation

See [components/status-tag/index.md](../../../components/status-tag/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/status-tag/macro.njk" import statusTag %}

{{ statusTag({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
