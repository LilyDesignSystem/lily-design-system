# FileUpload

A drag-and-drop area for uploading files.

See `components/file-upload/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `file-upload`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FileUpload Label="...">
    Content
</FileUpload>
```
