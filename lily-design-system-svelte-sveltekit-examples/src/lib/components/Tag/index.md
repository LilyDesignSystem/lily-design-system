# Tag

## Overview

A headless tag for displaying labels, categories, keywords, or status
indicators. Renders as an inline <span> with role="status" and an accessible
label, creating an implicit live region so screen readers announce content
changes. Commonly used in content management, product listings, article
metadata, and filtering interfaces to visually group or classify content.

## What it does

A keyword label for categorizing content.

## When to use

- Use when you need a keyword label for categorizing content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Tag label="Category">Design</Tag>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for screen readers via aria-label. |
| `children` | Snippet, required | The tag's visible content (text, etc.). |
| `...restProps` | additional HTML attributes spread onto the <span> |  |

## Examples

```svelte
<!-- Status tag -->
<Tag label="Status">Active</Tag>

<!-- Priority tag with expanded context -->
<Tag label="Priority: High">High</Tag>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Tag from "$lib/components/Tag/Tag.svelte";
</script>

<Tag label="Category">Design</Tag>
```

## Keyboard

- None -- tags are informational, not interactive

## Accessibility

- role="status" enables live region announcements for screen readers
- aria-label provides expanded context beyond the visible tag text

## Internationalization

- The label prop externalizes user-facing text for translation
- All visible content is provided through the children snippet
- No hardcoded strings in the component

## References

- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
