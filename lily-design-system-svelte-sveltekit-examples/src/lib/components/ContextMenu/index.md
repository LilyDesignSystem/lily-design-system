# ContextMenu

## Overview

A headless context menu that displays a list of actions relevant to the current
context, typically triggered by a right-click or long-press. When opened, focus
moves to the first menu item automatically. Arrow keys navigate between items
with wrapping, and Escape closes the menu. Consumers trigger opening externally
and provide role="menuitem" children. Used with ContextMenuItem children.

## What it does

A menu that appears on right-click or long-press.

## When to use

- Use when offering a list of commands or options from a trigger.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ContextMenu label="Actions" bind:open>
  <ContextMenuItem>Cut</ContextMenuItem>
</ContextMenu>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the context menu via aria-label. |
| `open` | boolean, default false | Whether the menu is visible; bindable for two-way control. |
| `children` | Snippet, required | Menu item content (should include role="menuitem" elements). |
| `...restProps` | additional HTML attributes spread onto the menu <div> |  |

## Examples

```svelte
<!-- Context menu with multiple actions -->
<ContextMenu label="Actions" bind:open>
  <li role="menuitem" tabindex="-1">Cut</li>
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ContextMenu>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ContextMenu from "$lib/components/ContextMenu/ContextMenu.svelte";
</script>

<ContextMenu label="Actions" bind:open>
  <ContextMenuItem>Cut</ContextMenuItem>
</ContextMenu>
```

## Keyboard

- ArrowDown: Move focus to the next menu item (wraps to first)
- ArrowUp: Move focus to the previous menu item (wraps to last)
- Home: Move focus to the first menu item
- End: Move focus to the last menu item
- Escape: Close the menu

## Accessibility

- role="menu" identifies the container as a menu widget
- aria-label provides an accessible name for the menu
- Focus is automatically moved to the first menuitem when opened via $effect

## Internationalization

- The label prop provides the accessible name; no hardcoded strings
- All menu item content is provided by consumers through children

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
