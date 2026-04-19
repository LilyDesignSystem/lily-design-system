# BreadcrumbList

## Overview

An ordered list that contains BreadcrumbListItem children, representing
the hierarchical trail in a breadcrumb navigation. Renders a semantic
<ol> element to convey the ordered relationship of pages. Must be placed
inside a BreadcrumbNav container.

## What it does

An ordered list of breadcrumb list items.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<BreadcrumbList>
  <BreadcrumbListItem>...</BreadcrumbListItem>
</BreadcrumbList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | BreadcrumbListItem elements. |
| `...restProps` | additional HTML attributes spread onto the <ol> |  |

## Examples

```svelte
<!-- Breadcrumb list inside a nav -->
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Widget</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import BreadcrumbList from "$lib/components/BreadcrumbList/BreadcrumbList.svelte";
</script>

<BreadcrumbList>
  <BreadcrumbListItem>...</BreadcrumbListItem>
</BreadcrumbList>
```

## Keyboard

- None — passive container. Keyboard interactions are handled
- by links within BreadcrumbListItem children.

## Accessibility

- <ol> conveys the ordered hierarchical relationship of the trail
- Implicit list role allows screen readers to announce item count

## Internationalization

- No user-facing strings; all content comes through children
- Separator characters (e.g. "/" or ">") should be added by the consumer

## References

- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
