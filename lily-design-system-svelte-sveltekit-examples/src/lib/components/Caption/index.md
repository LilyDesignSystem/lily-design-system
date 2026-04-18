# Caption

## Overview

A headless caption for providing supplementary text alongside images, videos,
charts, or other media. Renders as a semantic <figcaption> element, which
provides an implicit association with a parent <figure> element. Commonly used
in galleries, product pages, data visualizations, and educational content.

## What it does

A caption for a table or figure element.

## When to use

- Use when you need a caption for a table or figure element.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Caption>Photo of a sunset over the ocean.</Caption>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | The caption text or content to display. |
| `...restProps` | additional HTML attributes spread onto the <figcaption> |  |

## Examples

```svelte
<!-- Caption for a chart with an id for aria-describedby -->
<Caption id="chart-caption">Figure 1: Revenue growth over time.</Caption>

<!-- Caption inside a figure -->
<figure>
  <img src="sunset.jpg" alt="Sunset over the ocean" />
  <Caption>Photo taken at Malibu beach.</Caption>
</figure>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Caption from "$lib/components/Caption/Caption.svelte";
</script>

<Caption>Photo of a sunset over the ocean.</Caption>
```

## Keyboard

- None — this component is a passive container for descriptive text.

## Accessibility

- Implicit semantics from <figcaption> — automatically associated with parent <figure>
- Can be referenced via id and aria-describedby from other elements

## Internationalization

- All text comes through children snippet; no hardcoded strings

## References

- MDN figcaption: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption
