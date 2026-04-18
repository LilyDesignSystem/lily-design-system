# ImageFileInput

## Overview

An image file input that provides a file upload control pre-configured to accept
image files. Wraps a native <input type="file"> element with accessible labeling
and sensible defaults for image selection. Useful for profile photo uploads, gallery
image selection, document scanning, and any form requiring image file input.

## What it does

An input for selecting image files with preview.

## When to use

- Use when you need the user to enter or pick a value in a form.

## When not to use

- Do not use for read-only display — use the matching `*View` component instead.

## Usage

```svelte
<ImageFileInput label="Upload profile photo" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `accept` | string, default "image/*" | MIME type filter for the file picker dialog. |
| `required` | boolean, default false | Whether the input is required for form submission. |
| `disabled` | boolean, default false | Whether the input is disabled. |
| `...restProps` | additional HTML attributes spread onto the input element |  |

## Examples

```svelte
<!-- Basic image upload -->
<ImageFileInput label="Upload profile photo" />

<!-- Restricted to specific image formats -->
<ImageFileInput label="Upload document scan" accept="image/png, image/jpeg" required />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ImageFileInput from "$lib/components/ImageFileInput/ImageFileInput.svelte";
</script>

<ImageFileInput label="Upload profile photo" />
```

## Keyboard

- Tab: Focus the file input
- Enter / Space: Open the file picker dialog (native browser behavior)

## Accessibility

- aria-label provides an accessible name for the file input
- Uses native <input type="file"> which provides built-in keyboard and screen reader support

## Internationalization

- The label prop allows localized accessible names; no hardcoded user-facing strings

## References

- MDN Input type="file": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
