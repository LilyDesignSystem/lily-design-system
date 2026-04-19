# Carousel

## Overview

A headless carousel container for cycling through slides or content items.
Renders a <div> with role="region" and aria-roledescription="carousel" so
assistive technologies announce it properly. Used for image galleries, product
showcases, testimonial rotators, and featured content. The consumer provides
all slide content, navigation controls, and autoplay logic.

## What it does

A slideshow for cycling through content items.

## When to use

- Use when you need a slideshow for cycling through content items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Carousel label="Photo gallery">
  <div role="group" aria-label="Slide 1">...</div>
</Carousel>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the carousel region. |
| `children` | Snippet, required | Slide content to render inside the carousel container. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Carousel with labeled slides -->
<Carousel label="Featured products">
  {#each slides as slide, i}
    <div role="group" aria-roledescription="slide" aria-label="Slide {i + 1} of {slides.length}">
      {slide.content}
    </div>
  {/each}
</Carousel>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Carousel from "$lib/components/Carousel/Carousel.svelte";
</script>

<Carousel label="Photo gallery">
  <div role="group" aria-label="Slide 1">...</div>
</Carousel>
```

## Keyboard

- None built-in — the consumer should implement navigation controls
- (previous/next buttons, arrow keys for slide navigation).

## Accessibility

- role="region" identifies the carousel as a landmark
- aria-roledescription="carousel" overrides the default "region" announcement
- aria-label provides an accessible name describing the carousel content

## Internationalization

- Label text comes through the label prop; no hardcoded strings
- Slide content and navigation labels are provided by the consumer

## References

- WAI-ARIA Carousel Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- WAI-ARIA Authoring Practices Carousel: https://www.w3.org/WAI/tutorials/carousels/
