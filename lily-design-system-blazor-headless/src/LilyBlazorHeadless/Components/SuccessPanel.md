# SuccessPanel

A panel confirming a task has been completed.

See `components/success-panel/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `success-panel`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SuccessPanel>
    Content
</SuccessPanel>
```
