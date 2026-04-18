# AccordionListItem

## Overview

A single expandable section within an AccordionList, using the native
HTML <details> element for built-in disclosure behavior. The consumer
provides a <summary> element (the clickable header) and content (the
expandable body) as children. The open prop is two-way bindable via
$bindable(), allowing parent components to programmatically control
and observe the expanded state.

## What it does

An accordion list item component.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<AccordionListItem>
  <summary>Header</summary>
  <p>Content</p>
</AccordionListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `open` | boolean, default false, bindable | Whether the item is expanded. |
| `children` | Snippet, required | A <summary> and content elements. |
| `...restProps` | additional HTML attributes spread onto <details> |  |

## Examples

```svelte
<!-- Basic accordion item -->
<AccordionListItem>
  <summary>What is Svelte?</summary>
  <p>A compiler-based UI framework.</p>
</AccordionListItem>

<!-- Pre-expanded with binding -->
<AccordionListItem bind:open={isOpen}>
  <summary>Details</summary>
  <p>Expanded content.</p>
</AccordionListItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import AccordionListItem from "$lib/components/AccordionListItem/AccordionListItem.svelte";
</script>

<AccordionListItem>
  <summary>Header</summary>
  <p>Content</p>
</AccordionListItem>
```

## Keyboard

- Tab: Focus the summary element
- Enter / Space: Toggle open/close (browser native behavior)

## Accessibility

- Native <details> provides implicit disclosure widget semantics
- Browser automatically manages expanded/collapsed state announcement

## Internationalization

- No hardcoded text; all content comes through children

## References

- HTML details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
