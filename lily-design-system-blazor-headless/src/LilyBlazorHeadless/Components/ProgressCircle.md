# ProgressCircle

A circular progress indicator.

See `components/progress-circle/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `progress-circle`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ProgressCircle Label="...">
    Content
</ProgressCircle>
```
