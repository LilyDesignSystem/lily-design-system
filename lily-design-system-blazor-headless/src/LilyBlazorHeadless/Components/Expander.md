# Expander

A control that expands to reveal more content.

See `components/expander/index.md` for canonical documentation.

The region exists only while expanded.

## Parameters

- `Label`: string (required) — the button's text and the region's name
- `Expanded`, `ExpandedChanged`: bool — two-way with `@bind-Expanded`
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<Expander Label="More" @bind-Expanded="expanded">...</Expander>
```
