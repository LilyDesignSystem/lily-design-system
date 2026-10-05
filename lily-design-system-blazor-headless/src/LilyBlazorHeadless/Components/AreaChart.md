# AreaChart

An area chart visualization showing sized components in continuous data.

See `components/area-chart/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `area-chart`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AreaChart Label="...">
    Content
</AreaChart>
```

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="area-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional the `DataTable` render-fragment parameter renders the accessible table in `<div class="area-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Unmatched attributes still spread onto the `<figure>`. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
