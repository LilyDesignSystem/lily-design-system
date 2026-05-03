# DownloadButton

A download link styled as a button, with optional file size and format metadata.

See `components/download-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `download-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DownloadButton Label="...">
    Content
</DownloadButton>
```
