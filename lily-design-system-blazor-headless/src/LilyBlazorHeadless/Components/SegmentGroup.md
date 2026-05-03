# SegmentGroup

A group of mutually exclusive segment options.

See `components/segment-group/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `segment-group`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SegmentGroup Label="...">
    Content
</SegmentGroup>
```
