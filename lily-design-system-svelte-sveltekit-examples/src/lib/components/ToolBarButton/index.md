# ToolBarButton

## Overview

A single button within a ToolBar. Renders as a native <button> element
with type="button" for proper keyboard and screen reader support. The
component avoids unintended form submissions and supports the disabled
attribute for disabling interaction. Designed to be placed inside a ToolBar
container that manages roving focus keyboard navigation.

## What it does

One action button in a tool bar.

## When to use

- Use for an in-page action (not navigation).

## When not to use

- Do not use for navigation to another URL — use a link instead.

## Usage

```svelte
<ToolBarButton>Bold</ToolBarButton>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `disabled` | boolean, default false | Whether the button is disabled. |
| `children` | Snippet, required | Button content. |
| `...restProps` | additional HTML attributes spread onto the <button> |  |

## Examples

```svelte
<!-- Toolbar with buttons -->
<ToolBar label="Editor tools">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton disabled>Redo</ToolBarButton>
</ToolBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ToolBarButton from "$lib/components/ToolBarButton/ToolBarButton.svelte";
</script>

<ToolBarButton>Bold</ToolBarButton>
```

## Keyboard

- Enter/Space: activate the button (native behavior)
- Arrow keys: handled by parent ToolBar for roving focus navigation
- Button is skipped in tab order when disabled

## Accessibility

- Implicit button role from the <button> element
- disabled attribute communicates disabled state to assistive technology

## Internationalization

- All text is provided through the children snippet
- No hardcoded user-facing strings

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
