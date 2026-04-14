# File Input

A file input wraps a native `<input type="file">` element with accessible labelling. It allows users to select one or more files from their device for upload. The component supports filtering by accepted file types, multiple file selection, and standard form states.

This component is useful in upload forms, profile editors, document management interfaces, and anywhere users need to attach files. It provides a headless wrapper around the native file picker, leaving all visual presentation to the consumer.

## Implementation Notes

- Renders a native `<input type="file">` element
- Uses `aria-label` for accessible naming (no visible label element included; consumers can add their own)
- Supports `accept` attribute for restricting file types (e.g., `"image/*"`, `".pdf,.doc"`)
- Supports `multiple` attribute for allowing selection of more than one file
- Supports standard HTML form attributes: `required`, `disabled`
- Spreads `restProps` for consumer customization (e.g., `capture`, event handlers)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `accept`: string (default: `undefined`) -- comma-separated list of accepted file types (MIME types or extensions)
- `multiple`: boolean (default: `false`) -- whether multiple files can be selected
- `required`: boolean (default: `false`) -- whether a file selection is required
- `disabled`: boolean (default: `false`) -- whether the file input is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

Document attachment allowing multiple files:

```html
<FileInput label="Attach supporting documents" accept=".pdf,.doc,.docx" multiple={true} required />
```

Single file upload for a form submission:

```html
<FileInput label="Upload signed consent form" accept=".pdf" required />
```

Optional photo upload:

```html
<FileInput label="Upload photo" accept="image/png,image/jpeg" />
```

## Keyboard Interactions

None beyond native input behavior -- **Enter** or **Space** opens the file picker dialog when the input is focused (browser-native behavior).

## ARIA

- `aria-label={label}` -- provides an accessible name for the file input since no visible `<label>` element is included

## When to Use

- Use for a native HTML file input element when the simplest file selection is needed.
- Use when users need to select one or more files from their device.
- Use when the native file picker is sufficient and a drag-and-drop area is not needed.
- Use in upload forms, profile editors, or document attachment fields.

## When Not to Use

- Do not use when drag-and-drop is needed -- use FileUpload instead.
- Do not use for image selection with preview -- use ImageFileInput instead.
- Do not use when you need a styled upload button with status feedback -- use FileUpload instead.

## Headless

This headless component provides a native `<input type="file">` with accessible labeling via `aria-label`, support for `accept`, `multiple`, `required`, and `disabled` attributes, and `restProps` for consumer extensibility. The consumer provides all visual styling, custom button appearance, and any file list display.


## Styles

The consumer provides all CSS styling. The component renders with a `.file-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `file-input`
- Verify aria-label={label}` -- provides an accessible name for the file input since no visible `<label>` element is included
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider pairing the file input with a visible label or instructions about accepted file types and size limits. The default browser styling varies, so plan for custom styling.
- **Developers**: Use the `accept` prop to restrict file types at the browser level, but always validate on the server as well. Access selected files via the input's `files` property or event handlers.

## References

- MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
