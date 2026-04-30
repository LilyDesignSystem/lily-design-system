# TaskBar

A horizontal bar of task shortcuts or actions.

## Canonical documentation

See [components/task-bar/index.md](../../../components/task-bar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/task-bar/macro.njk" import taskBar %}

{{ taskBar({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
