# ColumnChart

A vertical column chart visualization for displaying data.

## Canonical documentation

See [components/column-chart/index.md](../../../components/column-chart/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/column-chart/macro.njk" import columnChart %}

{{ columnChart({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="column-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `params.dataTable` (raw HTML) renders the accessible table in `<div class="column-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. `params.describedBy` sets `aria-describedby` on the image wrapper; `id`, `classes` and `attributes` stay on the `<figure>`. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
