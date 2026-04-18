# FileUpload

## Overview

A button-triggered file picker for uploading files. Combines a hidden
<input type="file"> with a visible button and a live status region that
announces how many files have been selected. Useful for document uploads,
image uploads, and any form that accepts file attachments.

## What it does

A drag-and-drop area for uploading files.

## When to use

- Use when you need a drag-and-drop area for uploading files.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the upload button; also displayed as button text. |
| `accept` | string, default undefined | Accepted file types (e.g., ".pdf", "image/*"). |
| `multiple` | boolean, default false | Whether to allow selecting multiple files. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `onchange` | (files: FileList \| null) => void, default undefined | Callback when files are selected. |
| `...restProps` | additional HTML attributes spread onto the outer <div> |  |

## Examples

```svelte
<!-- Basic file upload -->
<FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />

<!-- Multiple image upload -->
<FileUpload label="Upload images" accept="image/*" multiple onchange={handleImages} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FileUpload from "$lib/components/FileUpload/FileUpload.svelte";
</script>

<FileUpload label="Upload files" accept=".pdf" onchange={handleFiles} />
```

## Keyboard

- Tab: focus the upload button
- Enter/Space: activate the file picker dialog (native button behavior)

## Accessibility

- aria-label on the button provides the accessible name
- aria-live="polite" on the status span announces file count changes
- data-file-count attribute for consumer CSS or testing
- Hidden file input is triggered via button click

## Internationalization

- The label prop accepts any string; consumers provide localized text
- Status text "file"/"files" is hardcoded; override via consumer if needed

## References

- MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
