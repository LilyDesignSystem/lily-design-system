# KanbanTableFoot

A kanban board table interactive grid tfoot for organizing items by status <tfoot>.

## Canonical documentation

See [components/kanban-table-foot/index.md](../../../components/kanban-table-foot/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/kanban-table-foot/macro.njk" import kanbanTableFoot %}

{{ kanbanTableFoot({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
