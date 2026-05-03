# AlertDialog

A modal dialog for urgent messages requiring user acknowledgment.

See `components/alert-dialog/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `alert-dialog`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AlertDialog>
    Content
</AlertDialog>
```
