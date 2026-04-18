# ImageFileInput

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

```svelte
<ImageFileInput label="Upload profile photo" />
```

```svelte
<ImageFileInput label="Upload document scan" accept="image/png, image/jpeg" required />
```

## Keyboard Interactions

None -- this component uses the native `<input type="file">` element, which provides built-in keyboard support (Tab to focus, Enter or Space to open the file picker dialog).

## ARIA

- `aria-label` -- provides an accessible name for the file input when no visible label is present.

## References

- MDN Input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
