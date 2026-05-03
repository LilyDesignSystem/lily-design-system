# ClipboardCopyButton

A button that copies text to the clipboard.

See `components/clipboard-copy-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `clipboard-copy-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ClipboardCopyButton Label="...">
    Content
</ClipboardCopyButton>
```
