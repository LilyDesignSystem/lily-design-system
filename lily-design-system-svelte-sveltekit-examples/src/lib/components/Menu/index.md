# Menu

## Overview

A headless menu container using the ARIA menu role with full vertical
keyboard navigation. It renders a <div> with role="menu" and manages focus
movement between child menuitem elements via arrow keys. Menus present a
list of discrete actions or commands, such as context menus, action menus
triggered by buttons, or dropdown menus.

## What it does

A list of actions or options triggered by a button.

## When to use

- Use when offering a list of commands or options from a trigger.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Menu label="Actions">
  <div role="menuitem" tabindex="-1">Cut</div>
</Menu>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `children` | Snippet, required | Menu item elements (should have role="menuitem" and tabindex="-1"). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Basic action menu -->
<Menu label="Actions">
  <div role="menuitem" tabindex="-1">Cut</div>
  <div role="menuitem" tabindex="-1">Copy</div>
  <div role="menuitem" tabindex="-1">Paste</div>
</Menu>

<!-- Dynamic menu with click handlers -->
<Menu label="File actions">
  {#each actions as action}
    <div role="menuitem" tabindex="-1" onclick={() => handleAction(action)}>
      {action.label}
    </div>
  {/each}
</Menu>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Menu from "$lib/components/Menu/Menu.svelte";
</script>

<Menu label="Actions">
  <div role="menuitem" tabindex="-1">Cut</div>
</Menu>
```

## Keyboard

- ArrowDown: move focus to next menu item, wrapping from last to first
- ArrowUp: move focus to previous menu item, wrapping from first to last
- Home: move focus to the first menu item
- End: move focus to the last menu item

## Accessibility

- role="menu" identifies the container as a menu widget for actions
- aria-label provides an accessible name describing the menu purpose
- Child elements should use role="menuitem" with tabindex="-1"

## Internationalization

- The label prop accepts any translated string
- All menu item content comes through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
