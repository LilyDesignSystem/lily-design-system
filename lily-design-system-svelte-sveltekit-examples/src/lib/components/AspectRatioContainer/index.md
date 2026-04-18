# AspectRatioContainer

## Overview

A headless layout container that maintains a specific width-to-height
aspect ratio for its content. Sets CSS aspect-ratio-container via a style attribute
and exposes a data-aspect-ratio-container attribute for consumer styling hooks.
Useful for responsive images, videos, cards, and any content that must
maintain consistent proportions across screen sizes.

## What it does

A container that maintains a fixed aspect ratio.

## When to use

- Use when you need a container that maintains a fixed aspect ratio.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<AspectRatioContainer ratio={16/9}>content</AspectRatioContainer>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `ratio` | number, default 1 | Aspect ratio as width/height. Common values: 16/9, 4/3, 1 (square), 21/9 (ultrawide). |
| `children` | Snippet, required | Content to display inside the container. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- 16:9 video container -->
<AspectRatioContainer ratio={16/9}>
  <video src="video.mp4"></video>
</AspectRatioContainer>

<!-- Square avatar frame -->
<AspectRatioContainer ratio={1}>
  <img src="avatar.jpg" alt="User avatar" />
</AspectRatioContainer>

<!-- 4:3 card layout -->
<AspectRatioContainer ratio={4/3} data-testid="card-frame">
  <p>Card content</p>
</AspectRatioContainer>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AspectRatioContainer from "$lib/components/AspectRatioContainer/AspectRatioContainer.svelte";
</script>

<AspectRatioContainer ratio={16/9}>content</AspectRatioContainer>
```

## Keyboard

- None — this is a layout utility, not an interactive element.

## Accessibility

- No specific ARIA role needed; this is a layout utility
- Content within maintains its own accessibility semantics
- data-aspect-ratio-container attribute exposed for consumer CSS queries

## Internationalization

- No user-facing strings

## References

- CSS aspect-ratio-container: https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio-container
