# TaskListItem

One task item with a checkbox and label.

## Canonical documentation

See [components/task-list-item/index.md](../../../components/task-list-item/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/task-list-item/macro.njk" import taskListItem %}

{{ taskListItem({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
