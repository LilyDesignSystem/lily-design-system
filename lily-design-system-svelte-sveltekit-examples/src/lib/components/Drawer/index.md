# Drawer

## Overview

A panel that slides in from an edge of the viewport, typically used for
navigation menus, filters, or supplementary content. Renders conditionally
based on the open state and uses role="dialog" with aria-modal="true" for
proper screen reader behavior. The side prop indicates which edge via a
data-side attribute for consumer positioning and animation styles.

## What it does

A panel that slides in from the edge of the screen.

## When to use

- Use when you need a panel that slides in from the edge of the screen.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Drawer label="Nav" bind:open side="left">Content</Drawer>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `open` | boolean, default false | Whether the drawer is visible; bindable. |
| `label` | string, required | Accessible name for the drawer. |
| `side` | "left" \| "right" \| "top" \| "bottom", default "left" | Edge the drawer enters from. |
| `children` | Snippet, required | Drawer content. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Navigation drawer from left -->
<Drawer label="Navigation" bind:open side="left">
  <nav>...</nav>
</Drawer>

<!-- Filters drawer from right -->
<Drawer label="Filters" bind:open={showFilters} side="right">
  <form>...</form>
</Drawer>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Drawer from "$lib/components/Drawer/Drawer.svelte";
</script>

<Drawer label="Nav" bind:open side="left">Content</Drawer>
```

## Keyboard

- Escape: closes the drawer by setting open to false

## Accessibility

- role="dialog" identifies the drawer as a dialog
- aria-label provides the accessible name
- aria-modal="true" indicates the drawer is modal
- tabindex="-1" allows programmatic focus management
- data-side attribute conveys position for consumer styling

## Internationalization

- The label prop accepts any string; consumers provide localized text

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/dialog-modal/
