# ColumnChart

Headless ColumnChart component.

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="column-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `dataTable` named slot renders the accessible table in `<div class="column-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
