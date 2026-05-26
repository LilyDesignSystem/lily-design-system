# FileUpload

## Metadata

- Component: file-upload
- PascalCase: FileUpload
- Description: a drag-and-drop area for uploading files
- HTML tag: <div>
- CSS class: .file-upload
- Interactive: no

## Key Behaviors

- Renders a `<div>` container with a `<button>`, hidden `<input type="file">`, and a status `<span>`
- The button triggers the hidden file input via `click()` on the input ref
- Uses reactive state for the input element reference (`inputRef`) and the selected file count (`fileCount`)
- The status `<span>` uses `aria-live="polite"` to announce file selection changes to screen readers
- Exposes a `data-file-count` attribute on the status span for consumer CSS or testing
- The `onchange` callback receives the native `FileList` object
- Prevents default submit behavior by using `type="button"` on the trigger

## ARIA

- `aria-label="..."` -- provides an accessible name for the upload button
- `aria-live="polite"` -- on the status span, announces file selection count without interrupting the user

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the upload button, also used as visible button text
- `accept`: string (default: `undefined`) -- accepted file types (e.g., `".pdf"`, `"image/*"`)
- `multiple`: boolean (default: `false`) -- whether to allow selecting multiple files
- `disabled`: boolean (default: `false`) -- whether the button is disabled
- `onchange`: function (default: `undefined`) -- callback receiving `FileList | null` when files are selected
- `...restProps`: unknown -- additional attributes spread onto the outer `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="file-upload"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .file-upload in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/file-upload.html
- MDN `<input type="file">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
