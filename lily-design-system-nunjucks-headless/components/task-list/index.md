# TaskList

An ordered list of task list items.

## Canonical documentation

See [components/task-list/index.md](../../../components/task-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/task-list/macro.njk" import taskList %}

{{ taskList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
