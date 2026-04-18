# Splitter

## Overview

A headless draggable separator between resizable panels that uses the ARIA
separator role with keyboard focus and value tracking. Renders a <div> with
orientation, value range, and accessible labeling. Used between adjacent panels
to provide a visual and interactive handle for resizing.

## What it does

A draggable divider for resizing adjacent panels.

## When to use

- Use when you need a draggable divider for resizing adjacent panels.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Splitter label="Resize panels" orientation="vertical" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the splitter via aria-label. |
| `orientation` | "horizontal" \| "vertical", default "vertical" | The split direction. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Horizontal splitter between top and bottom panels -->
<Splitter label="Resize editor and preview" orientation="horizontal" />

<!-- Vertical splitter with custom aria-valuenow -->
<Splitter label="Resize sidebar" orientation="vertical" aria-valuenow={splitPos} />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Splitter from "$lib/components/Splitter/Splitter.svelte";
</script>

<Splitter label="Resize panels" orientation="vertical" />
```

## Keyboard

- Tab: moves focus to the splitter
- Arrow keys: consumer should implement to adjust split position
- Home: consumer should implement to set minimum position
- End: consumer should implement to set maximum position

## Accessibility

- role="separator" identifies the element as a separator between regions
- aria-label provides an accessible name describing the splitter's purpose
- aria-orientation indicates horizontal or vertical direction
- aria-valuenow/aria-valuemin/aria-valuemax report the split position
- tabindex="0" makes the splitter keyboard-focusable

## Internationalization

- The label prop externalizes the accessible label string

## References

- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
