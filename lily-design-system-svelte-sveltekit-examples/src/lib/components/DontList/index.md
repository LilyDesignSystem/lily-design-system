# DontList

## Overview

A list of discouraged actions or practices to avoid. Renders as a <ol> with
role="list" and an accessible label. Used in design system documentation,
guidelines, and instructional content to communicate what users should not do.
Paired with DoList to create do/don't guidance patterns.

## What it does

A guideline list of discouraged dont-list-item components.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<DontList><li>Avoid this</li></DontList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, default "Don't" | Accessible name for the list. |
| `children` | Snippet, required | List items, each should be an <li> element. |
| `...restProps` | additional HTML attributes spread onto the <ol> element |  |

## Examples

```svelte
<!-- Basic don't list -->
<DontList>
  <li>Skip alt text</li>
  <li>Use only color for meaning</li>
</DontList>

<!-- Custom label for internationalization -->
<DontList label="Avoid">
  <li>Hard-code user-facing strings</li>
  <li>Rely on placeholder text as labels</li>
</DontList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DontList from "$lib/components/DontList/DontList.svelte";
</script>

<DontList><li>Avoid this</li></DontList>
```

## Keyboard

- None — passive container for list items

## Accessibility

- role="list" preserves list semantics even when CSS removes default styling
- aria-label provides an accessible name (defaults to "Don't")

## Internationalization

- The label prop defaults to "Don't" but can be overridden for any locale
- All list item text comes through consumer-provided children

## References

- MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/
