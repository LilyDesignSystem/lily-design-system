# MenuItem

## Overview

A headless menu item representing a single action or option within a menu,
dropdown menu, or navigation menu. It renders a <div> with role="menuitem"
and tabindex="-1" for proper menu keyboard navigation. The parent menu
component manages focus between items with ArrowUp/ArrowDown keys.

## What it does

One item in a menu.

## When to use

- Use when you need one item in a menu.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<MenuItem>New File</MenuItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Menu item content (text, shortcut hint, etc.). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Basic menu items within a menu -->
<Menu label="File">
  <MenuItem>New File</MenuItem>
  <MenuItem>Open File</MenuItem>
  <MenuItem>Save</MenuItem>
</Menu>

<!-- Menu item with click handler -->
<MenuItem onclick={() => handleNew()}>New File</MenuItem>

<!-- Disabled menu item -->
<MenuItem aria-disabled="true">Paste</MenuItem>

<!-- Submenu trigger -->
<MenuItem aria-haspopup="true" aria-expanded={submenuOpen}>Recent Files</MenuItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MenuItem from "$lib/components/MenuItem/MenuItem.svelte";
</script>

<MenuItem>New File</MenuItem>
```

## Keyboard

- ArrowUp/ArrowDown: focus movement managed by parent Menu
- Enter/Space: activate the menu item (consumer-provided handler)
- Home/End: move to first/last item (handled by parent Menu)

## Accessibility

- role="menuitem" identifies this as a menu item
- tabindex="-1" for roving focus management by the parent menu
- Supports aria-disabled for disabled state
- Supports aria-haspopup and aria-expanded for submenu triggers
- Must be placed within a role="menu" or role="menubar" container

## Internationalization

- All visible content is provided through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
- WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem
