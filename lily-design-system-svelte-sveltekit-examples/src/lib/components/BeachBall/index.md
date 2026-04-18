# BeachBall

## Overview

A headless loading/waiting indicator inspired by the macOS spinning beach
ball cursor. Renders a <div> with role="status" and an inner <span> animation
target when active. Commonly used to indicate background processing, page
loads, or any busy state where the system is working on a task.

## What it does

A decorative animated beach ball element.

## When to use

- Use when you need a decorative animated beach ball element.

## When not to use

- Do not use for operations that complete almost instantly — avoid spinner flicker.

## Usage

```svelte
<BeachBall label="Loading content" />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible description of what is loading, applied via aria-label. |
| `active` | boolean, default true | Whether the loading indicator is currently active. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Conditional loading indicator -->
<BeachBall label="Processing request" active={isLoading} />

<!-- Always-visible loading indicator -->
<BeachBall label="Fetching data" />
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import BeachBall from "$lib/components/BeachBall/BeachBall.svelte";
</script>

<BeachBall label="Loading content" />
```

## Keyboard

- None — this is a passive informational indicator, not interactive.

## Accessibility

- role="status" identifies this as a status region for screen readers
- aria-live="polite" announces loading state changes without interrupting the user
- aria-busy reflects the active prop, signaling loading in progress
- aria-label describes what is loading, set from the label prop
- data-active attribute mirrors the active state for CSS selectors

## Internationalization

- All text comes through the label prop; no hardcoded strings

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- ARIA aria-busy: https://www.w3.org/TR/wai-aria-1.2/#aria-busy
