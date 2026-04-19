# MenuBar

## Overview

A headless horizontal menu bar using the ARIA menubar role, typically found
at the top of an application window. It renders a <div> with role="menubar"
and manages horizontal focus movement between top-level menu items via
ArrowLeft/ArrowRight keys, mimicking desktop application menu bars (e.g.,
File, Edit, View). Each top-level item may open a submenu or trigger an action.

## What it does

A horizontal bar of menu triggers.

## When to use

- Use when you need a horizontal bar of menu triggers.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<MenuBar label="Main menu">
  <MenuBarButton>File</MenuBarButton>
</MenuBar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name applied via aria-label. |
| `children` | Snippet, required | MenuBarButton elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Basic application menu bar -->
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
  import MenuBar from "$lib/components/MenuBar/MenuBar.svelte";
</script>

<MenuBar label="Main menu">
  <MenuBarButton>File</MenuBarButton>
</MenuBar>
```

## Keyboard

- ArrowRight: move focus to next menu bar item, wrapping from last to first
- ArrowLeft: move focus to previous menu bar item, wrapping from first to last
- Home: move focus to the first menu bar item
- End: move focus to the last menu bar item

## Accessibility

- role="menubar" identifies the container as a horizontal menu bar widget
- aria-label provides an accessible name describing the menu bar purpose
- Child MenuBarButton elements provide role="menuitem" with tabindex="-1"

## Internationalization

- The label prop accepts any translated string
- All menu bar item content comes through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
