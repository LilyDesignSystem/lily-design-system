# Collapsible

## Overview

A headless collapsible disclosure component built on native HTML <details> and
<summary> elements. Users click the summary text to expand or collapse the
content section. The open prop is bindable, enabling parent components to
programmatically control or observe the expanded/collapsed state. Commonly used
for FAQ sections, advanced settings, and progressive disclosure patterns.

## What it does

A container that can be expanded or collapsed.

## When to use

- Use when you need a container that can be expanded or collapsed.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Collapsible summary="More info">Content here</Collapsible>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `summary` | string, required | The clickable summary text shown as the toggle trigger. |
| `open` | boolean, default false | Whether the content is expanded; bindable for two-way control. |
| `children` | Snippet, required | The collapsible content revealed when expanded. |
| `...restProps` | additional HTML attributes spread onto the <details> |  |

## Examples

```svelte
<!-- Bindable open state for external control -->
<Collapsible summary="Advanced settings" bind:open={showAdvanced}>
  <p>Advanced configuration options here.</p>
</Collapsible>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Collapsible from "$lib/components/Collapsible/Collapsible.svelte";
</script>

<Collapsible summary="More info">Content here</Collapsible>
```

## Keyboard

- Enter: Toggle the disclosure open/closed (handled natively by <summary>)
- Space: Toggle the disclosure open/closed (handled natively by <summary>)

## Accessibility

- Native <details>/<summary> elements provide built-in expanded/collapsed state announcements
- No custom ARIA attributes needed; the browser handles all screen reader semantics

## Internationalization

- The summary prop provides the toggle label; no hardcoded strings
- All content is provided through the children snippet

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
