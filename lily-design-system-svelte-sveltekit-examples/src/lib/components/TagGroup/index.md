# TagGroup

## Overview

A headless container for a collection of related tags. Renders a <div>
with the ARIA group role and an accessible label to semantically associate
tag elements, making the collection understandable to assistive technologies.
Useful for displaying categories, skills, technologies, or any set of labels
that belong together.

## What it does

A group of tag elements.

## When to use

- Use when multiple related child components should be grouped semantically.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TagGroup label="Technologies">...</TagGroup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the group via aria-label. |
| `children` | Snippet, required | Tag elements to render inside the group. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Group of technology tags -->
<TagGroup label="Technologies">
  <Tag label="Technology">Svelte</Tag>
  <Tag label="Technology">TypeScript</Tag>
</TagGroup>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TagGroup from "$lib/components/TagGroup/TagGroup.svelte";
</script>

<TagGroup label="Technologies">...</TagGroup>
```

## Keyboard

- None -- passive container; keyboard behavior depends on child elements

## Accessibility

- role="group" identifies the container as a semantic grouping of related elements
- aria-label={label} provides an accessible name describing the tag collection

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
