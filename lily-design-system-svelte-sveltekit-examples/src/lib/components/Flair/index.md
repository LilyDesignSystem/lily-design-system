# Flair

## Overview

A small inline element used to add visual emphasis, categorization, or status
labeling to elements within an interface. Commonly used as tags, badges, or labels
in forums, social platforms, or dashboards to indicate user roles, content types,
statuses, or categories (e.g., "Moderator", "Urgent", "New").

## What it does

A decorative highlight or emphasis element.

## When to use

- Use when you need a decorative highlight or emphasis element.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Flair>New</Flair>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default undefined | Accessible label; omit for decorative flair, provide for meaningful flair. |
| `children` | Snippet, required | Flair content text. |
| `...restProps` | additional HTML attributes spread onto the span |  |

## Examples

```svelte
<!-- Decorative flair (hidden from screen readers) -->
<Flair>New</Flair>

<!-- Meaningful flair (announced to assistive technology) -->
<Flair label="Status: new">New</Flair>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Flair from "$lib/components/Flair/Flair.svelte";
</script>

<Flair>New</Flair>
```

## Keyboard

- None — this is a passive inline display element

## Accessibility

- aria-hidden="true" applied when no label is provided, marking the flair as decorative
- aria-label applied when label is provided, giving the flair an accessible name

## Internationalization

- All text content comes through the children snippet and label prop; no hardcoded strings
