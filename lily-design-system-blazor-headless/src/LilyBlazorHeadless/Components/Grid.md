# Grid

A CSS grid layout container with configurable columns and gap.

See `components/grid/index.md` for canonical documentation.

## Parameters

- `Columns`: string (default `"12"`) -- a column count or a `grid-template-columns` string
- `MinColumnWidth`: string (optional CSS length) -- fluid mode: `repeat(auto-fit, minmax(min(W, 100%), 1fr))`; wins over `Columns`
- `Gap`: string (default `"1rem"`)
- `CssClass`: string — extra CSS classes appended to `grid`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Grid>
    Content
</Grid>

<Grid MinColumnWidth="12rem">
    Cards (one column in a 120px container, no overflow)
</Grid>
```
