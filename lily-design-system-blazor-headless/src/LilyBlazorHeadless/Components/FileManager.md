# FileManager

A file browser for navigating and managing files.

See `components/file-manager/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `file-manager`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FileManager Label="...">
    Content
</FileManager>
```
