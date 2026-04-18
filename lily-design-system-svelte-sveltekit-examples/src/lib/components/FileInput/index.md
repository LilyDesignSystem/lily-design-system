# FileInput

## Overview

A file input wrapping a native <input type="file"> with accessible labeling.
Allows users to select one or more files from their device for upload. Supports
filtering by accepted file types, multiple file selection, and standard form
states. Used in upload forms, profile editors, and document management interfaces.

## What it does

An input for selecting files from the file system <input type="file">.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<FileInput label="Upload photo" accept="image/*" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name via aria-label. |
| `accept` | string, default undefined | Comma-separated accepted file types (MIME types or extensions). |
| `multiple` | boolean, default false | Whether multiple files can be selected. |
| `required` | boolean, default false | Whether a file selection is required. |
| `disabled` | boolean, default false | Whether the file input is disabled. |
| `...restProps` | additional HTML attributes spread onto the <input> |  |

## Examples

```svelte
<!-- Image file input -->
<FileInput label="Upload photo" accept="image/*" />

<!-- Multiple document upload -->
<FileInput label="Attach documents" accept=".pdf,.doc,.docx" multiple />

<!-- Required profile picture -->
<FileInput label="Profile picture" accept="image/png,image/jpeg" required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FileInput from "$lib/components/FileInput/FileInput.svelte";
</script>

<FileInput label="Upload photo" accept="image/*" />
```

## Keyboard

- Enter/Space: opens the file picker dialog (native browser behavior)

## Accessibility

- aria-label provides the accessible name since no visible <label> is included

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- MDN input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
