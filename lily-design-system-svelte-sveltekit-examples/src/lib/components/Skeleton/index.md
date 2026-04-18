# Skeleton

## Overview

A headless loading placeholder that indicates content is in the process of
loading. Shows the approximate layout of content before it arrives, reducing
perceived loading time and preventing layout shift. Hidden from screen readers
with aria-hidden="true" and signals loading state with aria-busy="true".

## What it does

A placeholder loading animation for content.

## When to use

- Use when you need a placeholder loading animation for content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Skeleton />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, optional | Placeholder content such as skeleton line shapes. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- With placeholder shapes -->
<Skeleton>
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
</Skeleton>

<!-- With sizing attributes -->
<Skeleton style="width:200px; height:20px;" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Skeleton from "$lib/components/Skeleton/Skeleton.svelte";
</script>

<Skeleton />
```

## Keyboard

- None — this is a passive placeholder hidden from interaction.

## Accessibility

- aria-hidden="true" hides the placeholder entirely from screen readers
- aria-busy="true" signals that this region is in a loading state
- Content will be replaced when loading completes

## Internationalization

- No user-facing text — purely a visual placeholder

## References

- WAI-ARIA aria-busy: https://www.w3.org/WAI/ARIA/apd/states/aria-busy/
- MDN aria-hidden: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
