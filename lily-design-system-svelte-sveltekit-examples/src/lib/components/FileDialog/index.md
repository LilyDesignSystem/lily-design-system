# FileDialog

## Overview

A modal dialog for file-related operations such as opening, saving, or
managing files. Renders a native <dialog> element conditionally based on
the open state, with accessible labeling and Escape key dismissal. Useful
in file managers, document editors, and content management systems where
the consumer provides file lists, action buttons, and navigation as children.

## What it does

A dialog for browsing and selecting files.

## When to use

- Use for modal or non-modal content that requires focused attention.

## When not to use

- Do not use for simple confirmations that can be expressed inline.

## Usage

```svelte
<FileDialog label="Open file" bind:open>Content</FileDialog>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the dialog. |
| `open` | boolean, default false | Whether the dialog is visible; bindable. |
| `children` | Snippet, required | Dialog content. |
| `...restProps` | additional HTML attributes spread onto the <dialog> element |  |

## Examples

```svelte
<!-- File open dialog -->
<FileDialog label="Open file" bind:open>
  <ul>
    <li>document.txt</li>
    <li>image.png</li>
  </ul>
  <button onclick={() => open = false}>Cancel</button>
</FileDialog>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FileDialog from "$lib/components/FileDialog/FileDialog.svelte";
</script>

<FileDialog label="Open file" bind:open>Content</FileDialog>
```

## Keyboard

- Escape: closes the dialog by setting open to false

## Accessibility

- aria-label provides the accessible name
- Native <dialog> element provides implicit role="dialog"
- tabindex="-1" allows programmatic focus management

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- MDN dialog element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
