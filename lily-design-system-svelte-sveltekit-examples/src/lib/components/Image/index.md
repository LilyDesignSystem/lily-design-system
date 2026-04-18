# Image

## Overview

An image component that displays visual content with proper accessibility through
required alt text and optional caption support. When a caption is provided, it renders
a <figure> containing the <img> and a <figcaption> for semantic association. Without
a caption, it renders a plain <img> element. Supports native lazy loading.

## What it does

An image element with alt text.

## When to use

- Use when you need an image element with alt text.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Image src="/photo.jpg" alt="Description" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `src` | string, required | The image source URL. |
| `alt` | string, required | Alternative text describing the image for screen readers. |
| `caption` | string, default undefined | When provided, wraps the image in a figure/figcaption. |
| `loading` | "lazy" \| "eager", default undefined | Controls native browser loading behavior. |
| `...restProps` | additional HTML attributes spread onto the root element (img or figure) |  |

## Examples

```svelte
<!-- Basic image with alt text -->
<Image src="/photo.jpg" alt="A sunset over the ocean" />

<!-- Image with caption wrapped in figure/figcaption -->
<Image src="/photo.jpg" alt="A sunset over the ocean" caption="Photo by Jane Doe" />

<!-- Lazy-loaded image -->
<Image src="/large-photo.jpg" alt="Landscape" loading="lazy" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Image from "$lib/components/Image/Image.svelte";
</script>

<Image src="/photo.jpg" alt="Description" />
```

## Keyboard

- None — images are not interactive by default

## Accessibility

- alt attribute provides the accessible name for the image (required)
- <figure> and <figcaption> semantically associate the caption with the image
- Screen readers announce the alt text when encountering the image

## Internationalization

- The alt and caption props allow localized text; no hardcoded user-facing strings

## References

- WAI Images Tutorial: https://www.w3.org/WAI/tutorials/images/
- HTML figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
