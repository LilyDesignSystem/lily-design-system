# StatusTag

A tag showing the current status of a task.

See `components/status-tag/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `status-tag`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<StatusTag Label="...">
    Content
</StatusTag>
```
