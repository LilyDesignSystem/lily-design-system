# Figure

## Overview

A container for graphical content such as charts, diagrams, illustrations,
or data visualizations. Renders a <figure> element with role="img" and an
accessible label. Used in dashboards, reports, analytics tools, and data-driven
applications. The consumer provides their preferred visualization (SVG, canvas,
or a charting library) as children.

## What it does

A self-contained figure with optional caption.

## When to use

- Use when you need a self-contained figure with optional caption.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Figure label="Monthly revenue">
  <svg><!-- chart here --></svg>
</Figure>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the figure content. |
| `children` | Snippet, required | The figure visualization content. |
| `...restProps` | additional HTML attributes spread onto the <figure> element |  |

## Examples

```svelte
<!-- Bar chart figure -->
<Figure label="Monthly revenue for 2024">
  <svg><!-- bar chart SVG here --></svg>
</Figure>

<!-- Canvas-based visualization -->
<Figure label="User growth trend">
  <canvas><!-- canvas chart here --></canvas>
</Figure>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Figure from "$lib/components/Figure/Figure.svelte";
</script>

<Figure label="Monthly revenue">
  <svg><!-- chart here --></svg>
</Figure>
```

## Keyboard

- None — passive container for data visualization

## Accessibility

- role="img" identifies the figure as a graphical image
- aria-label provides an accessible name describing the figure content

## Internationalization

- The label prop accepts any string; consumers provide localized descriptions

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
- MDN figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
