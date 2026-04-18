# BreadcrumbListItem

## Overview

A single step in a breadcrumb navigation trail. Renders as a semantic <li>
element designed to be placed inside a BreadcrumbList component. Supports
aria-current="page" to indicate the user's current location. Typically
contains a link for ancestor pages, or plain text for the current page.

## What it does

One breadcrumb list item in the trail.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `current` | boolean, default false | Whether this item represents the current page. |
| `children` | Snippet, required | Breadcrumb content, typically an <a> link or plain text. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Navigable ancestor page -->
<BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>

<!-- Current page (no link) -->
<BreadcrumbListItem current>About</BreadcrumbListItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import BreadcrumbListItem from "$lib/components/BreadcrumbListItem/BreadcrumbListItem.svelte";
</script>

<BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
```

## Keyboard

- None directly — keyboard interaction is handled by the contained links.

## Accessibility

- Implicit listitem role from the semantic <li> element
- aria-current="page" set when current is true, indicating the user's location

## Internationalization

- All text comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/breadcrumb/
