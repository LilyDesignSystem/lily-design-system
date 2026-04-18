# MenuBarButton

## Overview

A single interactive item within a menu bar, using the ARIA menuitem role
for keyboard navigation and screen reader support. It renders a <button> with
role="menuitem" and tabindex="-1", designed to be placed inside a MenuBar
container with role="menubar". Focus management is delegated to the parent
MenuBar which uses roving tabindex with arrow keys.

## What it does

One item in a menu bar.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<MenuBarButton>File</MenuBarButton>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | Content of the menu bar item. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Menu bar items within a MenuBar -->
<MenuBar label="Main menu">
  <MenuBarButton>File</MenuBarButton>
  <MenuBarButton>Edit</MenuBarButton>
  <MenuBarButton>View</MenuBarButton>
</MenuBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import MenuBarButton from "$lib/components/MenuBarButton/MenuBarButton.svelte";
</script>

<MenuBarButton>File</MenuBarButton>
```

## Keyboard

- ArrowLeft/ArrowRight: focus movement managed by parent MenuBar
- Enter/Space: activate the menu item (consumer-provided handler)
- tabindex="-1" enables programmatic focus from parent keyboard navigation

## Accessibility

- role="menuitem" identifies this as an item within a menubar
- tabindex="-1" removes from tab order; focus managed by parent MenuBar

## Internationalization

- All visible content is provided through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menubar/
