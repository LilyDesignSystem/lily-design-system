# SummaryList

An ordered list of key-value summary pairs.

See `components/summary-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `summary-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SummaryList Label="...">
    Content
</SummaryList>
```
