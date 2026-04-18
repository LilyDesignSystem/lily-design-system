# FileInput

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

```svelte
<FileInput label="Upload photo" accept="image/*" />
```

```svelte
<FileInput label="Attach documents" accept=".pdf,.doc,.docx" multiple={true} />
```

```svelte
<FileInput label="Profile picture" accept="image/png,image/jpeg" required={true} />
```

## Keyboard Interactions

None beyond native input behavior -- **Enter** or **Space** opens the file picker dialog when the input is focused (browser-native behavior).

## ARIA

- `aria-label={label}` -- provides an accessible name for the file input since no visible `<label>` element is included

## References

- MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
