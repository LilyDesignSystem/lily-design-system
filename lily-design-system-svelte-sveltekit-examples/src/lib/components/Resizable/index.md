# Resizable

## Overview

A headless resizable container that renders a focusable <div> region with
a data-resize attribute indicating the allowed resize direction. Used for
adjustable panels, panes, code editors, sidebars, or preview areas where
the user controls the container size.

## What it does

A container that the user can resize by dragging.

## When to use

- Use when you need a container that the user can resize by dragging.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Resizable label="Resizable panel" direction="both">
  <p>Content</p>
</Resizable>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the region via aria-label. |
| `direction` | "both" \| "horizontal" \| "vertical", default "both" | Which directions resizing is allowed. |
| `children` | Snippet, required | Content to render inside the container. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Horizontal-only resizing -->
<Resizable label="Sidebar" direction="horizontal">
  <nav>Links</nav>
</Resizable>

<!-- Vertical-only resizing -->
<Resizable label="Preview" direction="vertical">
  <div>Preview content</div>
</Resizable>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Resizable from "$lib/components/Resizable/Resizable.svelte";
</script>

<Resizable label="Resizable panel" direction="both">
  <p>Content</p>
</Resizable>
```

## Keyboard

- Tab: focuses the resizable region (tabindex="0")
- Consumer implements any keyboard-driven resize behavior

## Accessibility

- role="region" identifies the container as a landmark
- aria-label provides the accessible name
- tabindex="0" makes the container keyboard-focusable
- data-resize attribute exposes the direction for CSS targeting

## Internationalization

- The label prop externalizes the accessible label string

## References

- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
