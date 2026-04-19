# ToolBar

## Overview

A headless toolbar container that provides the ARIA toolbar role and built-in
keyboard navigation for action buttons and controls. It implements the roving
focus pattern with Left/Right arrow keys to move between items and Home/End
keys to jump to first/last items. Focus wraps around from last to first and
vice versa.

## What it does

A horizontal bar of tool actions.

## When to use

- Use when you need a horizontal bar of tool actions.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ToolBar label="Editor tools">...</ToolBar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the toolbar via aria-label. |
| `children` | Snippet, required | ToolBarButton elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Text editor toolbar -->
<ToolBar label="Editor tools">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton>Underline</ToolBarButton>
</ToolBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ToolBar from "$lib/components/ToolBar/ToolBar.svelte";
</script>

<ToolBar label="Editor tools">...</ToolBar>
```

## Keyboard

- ArrowRight: move focus to next item (wraps to first)
- ArrowLeft: move focus to previous item (wraps to last)
- Home: move focus to first item
- End: move focus to last item
- Tab: enter/exit the toolbar

## Accessibility

- role="toolbar" identifies the container as a toolbar widget
- aria-label provides the accessible name for the toolbar

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
