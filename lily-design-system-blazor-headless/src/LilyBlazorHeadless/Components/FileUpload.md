# FileUpload

A drag-and-drop area for uploading files.

See `components/file-upload/index.md` for canonical documentation.

The button clicks a hidden file input, through `FileUpload.razor.js`, which needs an interactive render mode.

## Parameters

- `Label`: string (required)
- `Accept`: string; `Multiple`, `Disabled`: bool
- `SelectedLabel`: Func<int, string> — the status for a count; plural forms are the consumer's
- `OnChange`: EventCallback<InputFileChangeEventArgs>
- `CssClass`, `AdditionalAttributes`

## Usage

```razor
<FileUpload Label="Choose files" Multiple="true" SelectedLabel="@(count => $"{count} chosen")" OnChange="AddFiles" />
```
