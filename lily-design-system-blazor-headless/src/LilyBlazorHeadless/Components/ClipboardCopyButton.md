# ClipboardCopyButton

A button that copies text to the clipboard.

See `components/clipboard-copy-button/index.md` for canonical documentation.

`data-copied` is `true` for two seconds after a copy. Copying needs a secure context and a user gesture, so handle `OnError`.

## Parameters

- `Text`, `Label`: string (required)
- `OnSuccess`: EventCallback; `OnError`: EventCallback<string>
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<ClipboardCopyButton Text="@link" Label="Copy link" OnSuccess="Copied">Copy</ClipboardCopyButton>
```
