# GanttTableTD

A Gantt chart table interactive grid data cell for planning schedule visualization <td>.

## Canonical documentation

See [components/gantt-table-td/index.md](../../../components/gantt-table-td/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/gantt-table-td/macro.njk" import ganttTableTd %}

{{ ganttTableTd({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
