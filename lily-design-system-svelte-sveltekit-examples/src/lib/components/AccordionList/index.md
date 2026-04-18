# AccordionList

## Overview

AccordionList elements within an AccordionNav. Provides an optional
accessible label for the list.

## What it does

An accordion ordered list of list item components.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<AccordionNav>
  <AccordionList>
    <AccordionListItem>...</AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, optional | Accessible name for the group via aria-label. |
| `children` | Snippet, required | AccordionListItem elements. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<AccordionNav label="My Nav">
  <AccordionList label="Questions">
    <AccordionListItem>
      <summary>What is this?</summary>
      <p>A design system.</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AccordionList from "$lib/components/AccordionList/AccordionList.svelte";
</script>

<AccordionNav>
  <AccordionList>
    <AccordionListItem>...</AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Keyboard

- None — passive container. Keyboard interactions are handled
- by AccordionListItem children.

## Accessibility

- aria-label optionally provides an accessible name for the group

## Internationalization

- The label prop accepts any translated string
- No hardcoded text

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
