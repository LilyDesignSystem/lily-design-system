# PaginationListItem

## Overview

A single entry within a PaginationList navigation component. It renders as a
semantic <li> element designed for use inside the PaginationList's <ul> structure.
The item typically contains a link or button for a specific page number,
previous/next controls, or an ellipsis indicator.

## What it does

One pagination list item in the trail.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<PaginationListItem><a href="/page/1">1</a></PaginationListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Item content, typically a link or button. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Page number link -->
<PaginationListItem><a href="/page/1">1</a></PaginationListItem>

<!-- Current page with aria-current -->
<PaginationListItem><a href="/page/2" aria-current="page">2</a></PaginationListItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import PaginationListItem from "$lib/components/PaginationListItem/PaginationListItem.svelte";
</script>

<PaginationListItem><a href="/page/1">1</a></PaginationListItem>
```

## Keyboard

- None directly — keyboard interaction is handled by the contained links or buttons.

## Accessibility

- Implicit listitem role from the semantic <li> element
- Consumer should set aria-current="page" on the active page link within the item

## Internationalization

- All text content comes through the children snippet
- No hardcoded user-facing strings

## References

- HTML li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
