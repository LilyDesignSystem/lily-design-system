# File Upload

A file upload component provides a button-triggered file picker for uploading files. It combines a hidden file input with a visible button and a live status region that announces how many files have been selected. This pattern is useful for document uploads, image uploads, or any form that accepts file attachments.

## Implementation Notes

- Renders a `<div>` container with a `<button>`, hidden `<input type="file">`, and a status `<span>`
- The button triggers the hidden file input via `click()` on the input ref
- Uses reactive state for the input element reference (`inputRef`) and the selected file count (`fileCount`)
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

```html
<Field label="Upload a scan of your referral letter">
  <Hint>The file must be a JPG, PNG, or PDF and be smaller than 5MB</Hint>
  <FileUpload label="Upload files" accept=".jpg,.png,.pdf" onchange={handleFiles} />
</Field>
```

```html
<Field label="Upload your test results" error="true">
  <ErrorMessage>The selected file must be smaller than 5MB</ErrorMessage>
  <FileUpload label="Upload files" accept=".jpg,.png,.pdf" onchange={handleFiles} />
</Field>
```

## Keyboard Interactions

None beyond native button behavior -- Tab to focus the button, Enter or Space to activate the file picker dialog.

## ARIA

- `aria-label="..."` -- provides an accessible name for the upload button
- `aria-live="polite"` -- on the status span, announces file selection count without interrupting the user

## When to Use

- Use when file upload is critical to delivering your service, such as uploading medical documents, photos, or identification.
- Use with clear guidance about accepted file types and maximum file size.
- Use with descriptive error messages that tell users exactly what went wrong and how to fix it.
- Use drag-and-drop alongside the file input button for an enhanced experience where supported.
- Use when a more polished upload experience is needed compared to a raw FileInput.

## When Not to Use

- Do not use when the information could be collected through form fields instead -- text input is simpler and more accessible.
- Do not use for image selection with preview -- use ImageFileInput which provides a preview before upload.
- Do not use for browsing and managing existing files -- use FileManager or FileDialog for that purpose.
- Do not use without specifying accepted file types -- users need to know what formats are allowed.

## Headless

This headless component provides a `<button>` trigger, a hidden `<input type="file">`, and a status `<span>` with `aria-live="polite"` that announces file selection changes. It manages the input ref and file count internally. The consumer provides all visual styling for the button, status text, and overall layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.file-upload` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `file-upload`
- Verify aria-label="..."` -- provides an accessible name for the upload button
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style the upload button prominently and display the file count or file names near the button after selection. Include accepted file type hints in nearby text.
- **Developers**: Use the `onchange` callback to receive the `FileList` for processing. The `data-file-count` attribute on the status span can be used for conditional CSS styling or testing.

## References

- MDN `<input type="file">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
