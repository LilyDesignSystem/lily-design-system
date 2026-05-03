# ContentBlock

A content width constraint container with named column widths.

See `components/content-block/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `content-block`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ContentBlock>
    Content
</ContentBlock>
```
