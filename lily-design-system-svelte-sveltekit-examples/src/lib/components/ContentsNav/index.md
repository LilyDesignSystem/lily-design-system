# ContentsNav

## Overview

A headless navigation landmark for a table of contents. Renders a semantic
<nav> element with an accessible label. Designed to wrap a ContentsList and
ContentsListItem children. Commonly used at the top of documentation pages,
articles, or forms with multiple sections.

## What it does

A contents navigation area.

## When to use

- Use to mark a region as primary navigation (landmark).

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ContentsNav label="Contents">
  <ContentsList>
    <ContentsListItem><a href="#section">Section</a></ContentsListItem>
  </ContentsList>
</ContentsNav>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the navigation landmark (e.g., "Contents"). |
| `children` | Snippet, required | Typically a ContentsList component. |
| `...restProps` | additional HTML attributes spread onto the <nav> |  |

## Examples

```svelte
<!-- Table of contents with multiple sections -->
<ContentsNav label="On this page">
  <ContentsList>
    <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
    <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
    <ContentsListItem><a href="#examples">Examples</a></ContentsListItem>
  </ContentsList>
</ContentsNav>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ContentsNav from "$lib/components/ContentsNav/ContentsNav.svelte";
</script>

<ContentsNav label="Contents">
  <ContentsList>
    <ContentsListItem><a href="#section">Section</a></ContentsListItem>
  </ContentsList>
</ContentsNav>
```

## Keyboard

- None — passive navigation container; keyboard navigation handled by anchor links within items

## Accessibility

- aria-label on <nav> provides an accessible name, distinguishing it from other nav regions

## Internationalization

- The label prop provides the accessible name; no hardcoded strings
- All link text is provided by consumers through children

## References

- WAI-ARIA Navigation Landmark: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- MDN nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
