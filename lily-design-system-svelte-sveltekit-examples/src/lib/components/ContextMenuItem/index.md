# ContextMenuItem

## Overview

A headless context menu item representing a single action within a context menu.
Renders a <div> with role="menuitem" and tabindex="-1" for proper menu keyboard
navigation. Focus is managed programmatically by the parent ContextMenu component
using Arrow keys. Should be placed within a role="menu" container. Commonly used
for right-click menu actions like cut, copy, paste, and delete.

## What it does

One item in a context menu.

## When to use

- Use when you need one item in a context menu.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ContextMenuItem>Cut</ContextMenuItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Menu item content (text, shortcut hint, etc.). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Multiple menu items within a context menu -->
<ContextMenuItem>Cut</ContextMenuItem>
<ContextMenuItem>Copy</ContextMenuItem>
<ContextMenuItem>Paste</ContextMenuItem>
<ContextMenuItem aria-disabled="true">Delete</ContextMenuItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ContextMenuItem from "$lib/components/ContextMenuItem/ContextMenuItem.svelte";
</script>

<ContextMenuItem>Cut</ContextMenuItem>
```

## Keyboard

- Focus is managed by the parent menu using ArrowUp/ArrowDown
- Enter/Space: Activate the menu item (handled by consumer event listeners)

## Accessibility

- role="menuitem" identifies this element as an item within a menu
- tabindex="-1" supports roving focus management by the parent menu
- Consumer can add aria-disabled="true" for disabled items
- Consumer can add aria-keyshortcuts for keyboard shortcut hints

## Internationalization

- All content is provided through the children snippet; no hardcoded strings

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
