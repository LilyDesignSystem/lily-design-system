# GanttTable

A Gantt chart table interactive grid for planning schedule visualization <table>.

## Canonical documentation

See [components/gantt-table/index.md](../../../components/gantt-table/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/gantt-table/macro.njk" import ganttTable %}

{{ ganttTable({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
