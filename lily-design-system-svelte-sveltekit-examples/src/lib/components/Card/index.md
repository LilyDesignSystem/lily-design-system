# Card

## Overview

A headless card that groups related content into a self-contained semantic
<article> element. Supports a configurable heading level (h2-h6) for proper
document outline, with an optional link wrapper on the heading. Commonly used
for product listings, user profiles, article previews, and dashboard widgets.

## What it does

A grouped content container with header, body, and footer areas.

## When to use

- Use to group related content in a single surfaceable container.

## When not to use

- Do not nest cards deeply or use a card as a generic container when a plain element suffices.

## Usage

```svelte
<Card><h3>Title</h3><p>Content</p></Card>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `heading` | string, optional | Heading text for the card. |
| `headingLevel` | 2 \| 3 \| 4 \| 5 \| 6, default 3 | HTML heading level. |
| `href` | string, optional | Makes the heading a link. |
| `label` | string, optional | aria-label for the article landmark. |
| `children` | Snippet, required | Card body content. |
| `...restProps` | additional HTML attributes spread onto the <article> |  |

## Examples

```svelte
<!-- Card with heading link -->
<Card heading="Product" href="/products/1"><p>Description</p></Card>

<!-- Card with custom heading level and label -->
<Card heading="Dashboard" headingLevel={2} label="Sales dashboard">
  <p>Revenue metrics</p>
</Card>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Card from "$lib/components/Card/Card.svelte";
</script>

<Card><h3>Title</h3><p>Content</p></Card>
```

## Keyboard

- Tab: Focus the heading link when href is provided
- Enter: Activate the heading link (browser default)

## Accessibility

- Implicit article role from <article> element
- Optional aria-label identifies the card as a named landmark
- Heading provides document outline structure at the specified level

## Internationalization

- All text comes through heading and children props; no hardcoded strings

## References

- MDN article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
