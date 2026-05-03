# FileDialog

A dialog for browsing and selecting files.

See `components/file-dialog/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `file-dialog`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FileDialog Label="...">
    Content
</FileDialog>
```
