# Sparkline

## Overview

A headless sparkline chart container that provides a semantic wrapper with
role="img" for compact, minimalist data visualizations. Sparklines display
trends or variations as tiny line, bar, or win/loss charts, typically embedded
within text or tables. The consumer provides SVG, canvas, or other rendering.

## What it does

A small inline chart showing a data trend.

## When to use

- Use when you need a small inline chart showing a data trend.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Sparkline label="Sales trend">
  <svg><!-- sparkline SVG --></svg>
</Sparkline>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the sparkline data via aria-label. |
| `children` | Snippet, required | The visualization content (SVG, canvas, etc.). |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Inline sparkline in a table cell -->
<Sparkline label="Revenue trend over past 7 days">
  <svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2" /></svg>
</Sparkline>

<!-- With canvas rendering -->
<Sparkline label="Temperature last 24 hours">
  <canvas width="100" height="20"></canvas>
</Sparkline>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Sparkline from "$lib/components/Sparkline/Sparkline.svelte";
</script>

<Sparkline label="Sales trend">
  <svg><!-- sparkline SVG --></svg>
</Sparkline>
```

## Keyboard

- None — this is a passive container for data visualization.

## Accessibility

- role="img" identifies the container as a graphical image
- aria-label describes what the sparkline represents
- Screen readers announce the label in place of the visual content

## Internationalization

- The label prop externalizes the data description for localization

## References

- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
