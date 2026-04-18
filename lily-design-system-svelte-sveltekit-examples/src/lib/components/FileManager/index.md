# FileManager

## Overview

A file management interface for browsing, organizing, and managing files and
directories. Renders a <div> with role="region" and an accessible label,
defining a semantic boundary for the file management area. Used in content
management systems, cloud storage apps, document editors, and admin dashboards.
The consumer provides file listings, navigation controls, and interaction behavior.

## What it does

A file browser for navigating and managing files.

## When to use

- Use when you need a file browser for navigating and managing files.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<FileManager label="Project files">Content</FileManager>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the file manager. |
| `children` | Snippet, required | The file browser content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Basic file listing -->
<FileManager label="Project files">
  <ul>
    <li>document.pdf</li>
    <li>image.png</li>
    <li>data.csv</li>
  </ul>
</FileManager>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import FileManager from "$lib/components/FileManager/FileManager.svelte";
</script>

<FileManager label="Project files">Content</FileManager>
```

## Keyboard

- None built-in — consumer implements keyboard navigation for file
- selection, folder traversal, and action triggers

## Accessibility

- role="region" defines the file manager as a named landmark section
- aria-label provides an accessible name for the region

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
