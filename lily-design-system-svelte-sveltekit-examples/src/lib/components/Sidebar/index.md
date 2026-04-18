# Sidebar

## Overview

A headless complementary region that uses the semantic <aside> element to
provide a labeled landmark for content tangentially related to the main
content. Commonly used for navigation menus, filters, related links, or
supplementary information alongside the primary page content.

## What it does

A side panel for navigation or supplementary content.

## When to use

- Use when you need a side panel for navigation or supplementary content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Sidebar label="Navigation">
  <nav>...</nav>
</Sidebar>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the sidebar region via aria-label. |
| `children` | Snippet, required | Content to render inside the sidebar. |
| `...restProps` | additional HTML attributes spread onto the <aside> |  |

## Examples

```svelte
<!-- Sidebar with filter controls -->
<Sidebar label="Filters">
  <form>
    <select><option>Category</option></select>
  </form>
</Sidebar>

<!-- Sidebar with related links -->
<Sidebar label="Related articles">
  <ul><li><a href="/article-1">Article 1</a></li></ul>
</Sidebar>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Sidebar from "$lib/components/Sidebar/Sidebar.svelte";
</script>

<Sidebar label="Navigation">
  <nav>...</nav>
</Sidebar>
```

## Keyboard

- None — this is a passive container. Keyboard navigation depends on interactive content inside.

## Accessibility

- <aside> element has implicit complementary landmark role
- aria-label distinguishes this sidebar from other landmarks on the page
- Screen readers announce it as a complementary landmark

## Internationalization

- The label prop externalizes the accessible label string

## References

- WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- HTML <aside> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
