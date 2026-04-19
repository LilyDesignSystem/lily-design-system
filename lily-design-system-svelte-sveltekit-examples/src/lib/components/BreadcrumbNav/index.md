# BreadcrumbNav

## Overview

A navigation landmark for a breadcrumb trail that shows the user's current
location within a site hierarchy. Renders a <nav> element with an accessible
label. Contains a BreadcrumbList which holds BreadcrumbListItem children.
Used in sites with deep hierarchies such as e-commerce catalogs,
documentation, and content management systems.

## What it does

A navigation container for breadcrumb trail links.

## When to use

- Use to mark a region as primary navigation (landmark).

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>...</BreadcrumbList>
</BreadcrumbNav>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the navigation landmark. |
| `children` | Snippet, required | BreadcrumbList element. |
| `...restProps` | additional HTML attributes spread onto the <nav> |  |

## Examples

```svelte
<!-- Full breadcrumb navigation -->
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
  import BreadcrumbNav from "$lib/components/BreadcrumbNav/BreadcrumbNav.svelte";
</script>

<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>...</BreadcrumbList>
</BreadcrumbNav>
```

## Keyboard

- Tab: Focus moves between links in the breadcrumb trail
- Enter: Activates the focused breadcrumb link

## Accessibility

- <nav> with aria-label creates a navigation landmark
- Screen readers announce the landmark name for orientation

## Internationalization

- Label text comes through the label prop; no hardcoded strings

## References

- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
