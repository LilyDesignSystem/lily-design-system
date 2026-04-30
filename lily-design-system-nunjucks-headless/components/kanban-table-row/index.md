# KanbanTableRow

A kanban board table interactive grid row for organizing items by status <tr>.

## Canonical documentation

See [components/kanban-table-row/index.md](../../../components/kanban-table-row/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kanban-table-row/macro.njk" import kanbanTableRow %}

{{ kanbanTableRow({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
