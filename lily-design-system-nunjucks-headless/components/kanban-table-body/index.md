# KanbanTableBody

A kanban board table interactive grid tbody for organizing items by status <tbody>.

## Canonical documentation

See [components/kanban-table-body/index.md](../../../components/kanban-table-body/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kanban-table-body/macro.njk" import kanbanTableBody %}

{{ kanbanTableBody({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
