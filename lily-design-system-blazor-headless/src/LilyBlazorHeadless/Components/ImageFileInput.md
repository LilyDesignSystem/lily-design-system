# ImageFileInput

An input for selecting image files with preview.

See `components/image-file-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `image-file-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ImageFileInput Label="...">
    Content
</ImageFileInput>
```
