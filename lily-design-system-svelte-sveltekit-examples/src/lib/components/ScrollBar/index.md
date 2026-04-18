# ScrollBar

## Overview

A headless scrollbar track element that provides the ARIA scrollbar role
and value attributes for a custom scrollbar control. Renders a <div> with
orientation, value range, and accessible labeling. The consumer provides the
visual thumb element as children and implements drag/scroll interaction logic.

## What it does

A custom scrollbar element.

## When to use

- Use when you need a custom scrollbar element.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ScrollBar orientation="vertical" label="Scroll">
  <div>thumb</div>
</ScrollBar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `orientation` | "vertical" \| "horizontal", default "vertical" | The scrollbar direction. |
| `label` | string, required | Accessible name for the scrollbar via aria-label. |
| `children` | Snippet, required | ScrollBar content, typically the draggable thumb element. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Horizontal scrollbar for a timeline -->
<ScrollBar orientation="horizontal" label="Timeline scroll">
  <div class="thumb"></div>
</ScrollBar>

<!-- Vertical scrollbar with custom attributes -->
<ScrollBar orientation="vertical" label="Page scroll" aria-valuenow={scrollPos}>
  <div class="thumb"></div>
</ScrollBar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ScrollBar from "$lib/components/ScrollBar/ScrollBar.svelte";
</script>

<ScrollBar orientation="vertical" label="Scroll">
  <div>thumb</div>
</ScrollBar>
```

## Keyboard

- Arrow Up/Left: scroll backward (decrease value) — consumer must implement
- Arrow Down/Right: scroll forward (increase value) — consumer must implement
- Page Up/Down: scroll by large increment — consumer must implement
- Home: scroll to beginning — consumer must implement
- End: scroll to end — consumer must implement

## Accessibility

- role="scrollbar" identifies the element as a scrollbar control
- aria-orientation indicates horizontal or vertical direction
- aria-valuenow/aria-valuemin/aria-valuemax track scroll position
- aria-label provides the accessible name

## Internationalization

- The label prop externalizes the accessible label string

## References

- WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar
