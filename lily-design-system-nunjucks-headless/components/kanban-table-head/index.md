# KanbanTableHead

A kanban board table interactive grid thead for organizing items by status <thead>.

## Canonical documentation

See [components/kanban-table-head/index.md](../../../components/kanban-table-head/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kanban-table-head/macro.njk" import kanbanTableHead %}

{{ kanbanTableHead({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
