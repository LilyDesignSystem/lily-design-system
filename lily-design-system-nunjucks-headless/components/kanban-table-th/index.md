# KanbanTableTH

A kanban board table interactive grid header cell for organizing items by status <th>.

## Canonical documentation

See [components/kanban-table-th/index.md](../../../components/kanban-table-th/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kanban-table-th/macro.njk" import kanbanTableTh %}

{{ kanbanTableTh({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
