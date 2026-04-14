# Image File Input

An image input provides a file upload control that is pre-configured to accept image files. It wraps a native `<input type="file">` element with accessible labeling and sensible defaults for image selection. This component is useful for profile photo uploads, gallery image selection, document scanning, and any form that requires image file input.

The consumer can override the accepted file types, control required/disabled states, and add additional attributes as needed.

## Implementation Notes

- Renders a single `<input type="file">` element with `accept="image/*"` by default.
- Uses `aria-label` for accessible naming since there is no visible `<label>` element.
- Supports `required` and `disabled` native input attributes.
- The `accept` prop defaults to `"image/*"` but can be narrowed (e.g., `"image/png, image/jpeg"`).
- Spreads `restProps` onto the `<input>` for consumer customization.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `accept`: string (default: `"image/*"`) -- MIME type filter for the file picker dialog.
- `required`: boolean (default: `false`) -- whether the input is required for form submission.
- `disabled`: boolean (default: `false`) -- whether the input is disabled.
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element.

## Usage

Profile photo upload:

```html
<ImageFileInput label="Upload profile photo" accept="image/png, image/jpeg" required />
```

Medical image attachment:

```html
<ImageFileInput label="Upload scan image" accept="image/png, image/jpeg, image/dicom" />
```

ID document scan:

```html
<ImageFileInput label="Upload ID photo" accept="image/png, image/jpeg" required />
```

## Keyboard Interactions

None -- this component uses the native `<input type="file">` element, which provides built-in keyboard support (Tab to focus, Enter or Space to open the file picker dialog).

## ARIA

- `aria-label` -- provides an accessible name for the file input when no visible label is present.

## When to Use

- Use for selecting image files with a preview before upload.
- Use for profile photos, document scans, or medical images.
- Use when you want to pre-filter the file picker to image files only via `accept="image/*"`.

## When Not to Use

- Do not use for non-image files -- use FileUpload or FileInput instead.
- Do not use without needing an image-specific file picker -- use FileInput instead.
- Do not use when drag-and-drop is needed -- use FileUpload instead.

## Headless

This headless component provides a native `<input type="file">` with `accept="image/*"` and `aria-label` for accessible file selection. The consumer provides all visual styling including the file button appearance, drag-and-drop zones, and image preview functionality.


## Styles

The consumer provides all CSS styling. The component renders with a `.image-file-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `image-file-input`
- Verify aria-label` -- provides an accessible name for the file input when no visible label is present.
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider adding an image preview area adjacent to the input so users can confirm their selection. Show accepted file type guidance near the input.
- **Developers**: Narrow the `accept` prop to specific MIME types (e.g., `"image/png, image/jpeg"`) when only certain formats are supported. Validate file size on the client side before submission.

## References

- MDN Input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
