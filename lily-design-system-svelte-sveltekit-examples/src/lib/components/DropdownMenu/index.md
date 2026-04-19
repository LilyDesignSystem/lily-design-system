# DropdownMenu

## Overview

A dropdown menu triggered by a button that reveals a list of actions or
options. Combines a toggle button with a conditionally rendered menu panel.
When the menu opens, focus moves automatically to the first menu item.
Common use cases include action menus, settings menus, and context-sensitive
option lists.

## What it does

A menu that opens below a trigger button.

## When to use

- Use when offering a list of commands or options from a trigger.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DropdownMenu label="Options" bind:open>
  <li role="menuitem" tabindex="-1">Action</li>
</DropdownMenu>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the menu button; also displayed as button text. |
| `open` | boolean, default false | Whether the menu is visible; bindable. |
| `children` | Snippet, required | Menu items, each should have role="menuitem" and tabindex="-1". |
| `...restProps` | additional HTML attributes spread onto the outer wrapper <div> |  |

## Examples

```svelte
<!-- Basic dropdown menu -->
<DropdownMenu label="Options" bind:open>
  <li role="menuitem" tabindex="-1">Edit</li>
  <li role="menuitem" tabindex="-1">Duplicate</li>
  <li role="menuitem" tabindex="-1">Delete</li>
</DropdownMenu>

<!-- With action handler -->
<DropdownMenu label="Actions" bind:open={menuOpen}>
  <li role="menuitem" tabindex="-1" onclick={() => handleAction('edit')}>Edit</li>
  <li role="menuitem" tabindex="-1" onclick={() => handleAction('delete')}>Delete</li>
</DropdownMenu>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DropdownMenu from "$lib/components/DropdownMenu/DropdownMenu.svelte";
</script>

<DropdownMenu label="Options" bind:open>
  <li role="menuitem" tabindex="-1">Action</li>
</DropdownMenu>
```

## Keyboard

- Enter/Space on button: toggles the menu open/closed
- ArrowDown: moves focus to the next menu item (wraps to first)
- ArrowUp: moves focus to the previous menu item (wraps to last)
- Home: moves focus to the first menu item
- End: moves focus to the last menu item
- Escape: closes the menu

## Accessibility

- aria-haspopup="true" on the trigger button indicates it opens a menu
- aria-expanded communicates whether the menu is shown
- aria-label on both button and menu provides accessible names
- role="menu" on the menu container identifies it as a menu widget
- Consumer provides role="menuitem" on each child item

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
- WAI-ARIA menu role: https://www.w3.org/TR/wai-aria-1.2/#menu
- WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem
