# ContentsList

## Overview

A headless ordered list for a table of contents. Renders a semantic <ol>
element containing ContentsListItem children. Designed to be placed inside
a ContentsNav component. The ordered list conveys the sequential nature of
page sections to assistive technology.

## What it does

An contents ordered list of contents list item components.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<ContentsList>
  <ContentsListItem><a href="#section">Section</a></ContentsListItem>
</ContentsList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | ContentsListItem components or <li> elements. |
| `...restProps` | additional HTML attributes spread onto the <ol> |  |

## Examples

```svelte
<!-- Contents list inside a navigation landmark -->
<ContentsNav label="On this page">
  <ContentsList>
    <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
    <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
  </ContentsList>
</ContentsNav>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ContentsList from "$lib/components/ContentsList/ContentsList.svelte";
</script>

<ContentsList>
  <ContentsListItem><a href="#section">Section</a></ContentsListItem>
</ContentsList>
```

## Keyboard

- None — passive list container; keyboard navigation handled by links within items

## Accessibility

- <ol> provides implicit list role conveying sequential section order

## Internationalization

- All content is provided by consumers through children; no hardcoded strings

## References

- MDN ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol
