# PopconfirmDialog

A popover dialog with confirm and cancel buttons.

See `components/popconfirm-dialog/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `popconfirm-dialog`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<PopconfirmDialog Label="...">
    Content
</PopconfirmDialog>
```
