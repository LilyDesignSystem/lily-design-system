# Splitter

A draggable divider for resizing adjacent panels.

See `components/splitter/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `splitter`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Splitter Label="...">
    Content
</Splitter>
```
