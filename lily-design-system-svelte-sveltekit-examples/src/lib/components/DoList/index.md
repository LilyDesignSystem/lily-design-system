# DoList

## Overview

A list of recommended actions or best practices. Renders as a <ol> with
role="list" and an accessible label. Used in design system documentation,
guidelines, and instructional content to communicate what users should do.
Paired with DontList to create do/don't guidance patterns.

## What it does

A guideline list of encouraged do-list-item components.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DoList><li>Best practice</li></DoList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default "Do" | Accessible name for the list. |
| `children` | Snippet, required | List items, each should be an <li> element. |
| `...restProps` | additional HTML attributes spread onto the <ol> element |  |

## Examples

```svelte
<!-- Basic do list -->
<DoList>
  <li>Write clear labels</li>
  <li>Use semantic HTML</li>
</DoList>

<!-- Custom label for internationalization -->
<DoList label="Recommended">
  <li>Provide alt text for images</li>
  <li>Use sufficient color contrast</li>
</DoList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DoList from "$lib/components/DoList/DoList.svelte";
</script>

<DoList><li>Best practice</li></DoList>
```

## Keyboard

- None — passive container for list items

## Accessibility

- role="list" preserves list semantics even when CSS removes default styling
- aria-label provides an accessible name (defaults to "Do")

## Internationalization

- The label prop defaults to "Do" but can be overridden for any locale
- All list item text comes through consumer-provided children

## References

- MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/
