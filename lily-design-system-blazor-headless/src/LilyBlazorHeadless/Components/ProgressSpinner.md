# ProgressSpinner

An indeterminate spinning progress indicator.

See `components/progress-spinner/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `progress-spinner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ProgressSpinner Label="...">
    Content
</ProgressSpinner>
```
