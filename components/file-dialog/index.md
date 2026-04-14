# File Dialog

A file dialog provides a modal dialog for file-related operations such as opening, saving, or managing files. It renders a native `<dialog>` element conditionally based on its `open` state, with accessible labelling and keyboard dismissal support.

This component is useful in applications that need custom file operation interfaces, such as file managers, document editors, or content management systems. The consumer provides all dialog content -- file lists, action buttons, and navigation controls -- as children.

## Implementation Notes

- Conditionally renders a `<dialog open>` element only when `open` is true
- Supports two-way binding on the `open` prop for two-way state binding
- Uses the native `<dialog>` HTML element with the `open` attribute
- Sets `tabindex="-1"` to allow the dialog to receive focus programmatically
- Escape key handler sets `open` to `false`
- Spreads `restProps` onto the `<dialog>` for consumer customization

## Props

- `label`: string (required) -- accessible name for the dialog, applied as `aria-label`
- `open`: boolean (default: false) -- whether the dialog is visible, two-way bindable via `open`
- `children`: slot (required) -- dialog content

## Usage

File open dialog with a file list and actions:

```html
<FileDialog label="Open file" open={fileDialogOpen}>
  <h2>Select a file</h2>
  <ul>
    <li><button onclick={() => selectFile('report.pdf')}>report.pdf</button></li>
    <li><button onclick={() => selectFile('data.csv')}>data.csv</button></li>
    <li><button onclick={() => selectFile('photo.jpg')}>photo.jpg</button></li>
  </ul>
  <button onclick={() => (fileDialogOpen = false)}>Cancel</button>
</FileDialog>
```

Save-as dialog:

```html
<FileDialog label="Save as" open={saveDialogOpen}>
  <label for="filename">File name</label>
  <input id="filename" type="text" value={fileName} />
  <button onclick={saveFile}>Save</button>
  <button onclick={() => (saveDialogOpen = false)}>Cancel</button>
</FileDialog>
```

## Keyboard Interactions

- Escape: closes the dialog by setting `open` to `false`

## ARIA

- `aria-label={label}` -- provides an accessible name for the dialog
- Native `<dialog>` element -- provides implicit `role="dialog"` semantics

## When to Use

- Use for a dialog interface for browsing and selecting files.
- Use for custom file operation interfaces such as open, save, or browse dialogs.
- Use in file managers, document editors, or CMS applications.
- Use when you need more control over the file selection UI than the native file picker provides.

## When Not to Use

- Do not use for simple file uploads -- use FileUpload instead.
- Do not use for file management and browsing within a page section -- use FileManager instead.
- Do not use when the modal content is not file-specific -- use Dialog instead.

## Headless

This headless component provides a native `<dialog>` element with conditional rendering, accessible labeling via `aria-label`, keyboard dismissal with Escape, and two-way binding on `open`. The consumer provides all visual styling, file listing content, navigation controls, and action buttons.


## Styles

The consumer provides all CSS styling. The component renders with a `.file-dialog` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<dialog>` element with class `file-dialog`
- Verify aria-label={label}` -- provides an accessible name for the dialog
- Verify Native `<dialog>` element -- provides implicit `role="dialog"` semantics
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include clear action buttons (Open, Cancel) and a file list or navigation area within the dialog. Provide visual feedback for the currently selected file.
- **Developers**: Manage focus by moving it into the dialog when opened and returning it to the trigger on close. Use the `open` binding to coordinate visibility with parent component state.

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
