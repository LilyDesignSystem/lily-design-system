# TimeoutDialog

A modal dialog warning users before session timeout.

See `components/timeout-dialog/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `timeout-dialog`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TimeoutDialog>
    Content
</TimeoutDialog>
```
