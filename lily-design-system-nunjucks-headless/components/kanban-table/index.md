# KanbanTable

A kanban board table interactive grid for organizing items by status <table>.

## Canonical documentation

See [components/kanban-table/index.md](../../../components/kanban-table/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kanban-table/macro.njk" import kanbanTable %}

{{ kanbanTable({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
