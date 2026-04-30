# GanttTableTH

A Gantt chart table interactive grid header cell for planning schedule visualization <th>.

## Canonical documentation

See [components/gantt-table-th/index.md](../../../components/gantt-table-th/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/gantt-table-th/macro.njk" import ganttTableTh %}

{{ ganttTableTh({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
