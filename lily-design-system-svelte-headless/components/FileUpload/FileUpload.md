# FileUpload

A file upload component provides a button-triggered file picker for uploading files. It combines a hidden file input with a visible button and a live status region that announces how many files have been selected. This pattern is useful for document uploads, image uploads, or any form that accepts file attachments.

## Implementation Notes

- Renders a `<div>` container with a `<button>`, hidden `<input type="file">`, and a status `<span>`
- The button triggers the hidden file input via `click()` on the input ref
- Uses `$state()` for the input element reference (`inputRef`) and the selected file count (`fileCount`)
- The status `<span>` uses `aria-live="polite"` to announce file selection changes to screen readers
- Exposes a `data-file-count` attribute on the status span for consumer CSS or testing
- The `onchange` callback receives the native `FileList` object
- Prevents default submit behavior by using `type="button"` on the trigger

## Props

- `label`: string (required) -- accessible name for the upload button, also used as visible button text
- `accept`: string (default: `undefined`) -- accepted file types (e.g., `".pdf"`, `"image/*"`)
- `multiple`: boolean (default: `false`) -- whether to allow selecting multiple files
- `disabled`: boolean (default: `false`) -- whether the button is disabled
- `onchange`: function (default: `undefined`) -- callback receiving `FileList | null` when files are selected
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>`

## Usage

```svelte
<FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
```

## Keyboard Interactions

None beyond native button behavior -- Tab to focus the button, Enter or Space to activate the file picker dialog.

## ARIA

- `aria-label="..."` -- provides an accessible name for the upload button
- `aria-live="polite"` -- on the status span, announces file selection count without interrupting the user

## References

- MDN `<input type="file">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
