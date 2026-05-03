# StatusLight

A small colored dot status indicator paired with a status label.

See `components/status-light/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `status-light`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<StatusLight Label="...">
    Content
</StatusLight>
```
