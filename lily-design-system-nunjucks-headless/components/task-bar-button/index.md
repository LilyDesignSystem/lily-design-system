# TaskBarButton

One item in a task bar.

## Canonical documentation

See [components/task-bar-button/index.md](../../../components/task-bar-button/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/task-bar-button/macro.njk" import taskBarButton %}

{{ taskBarButton({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
