# DoListItem

## Overview

A single recommended-practice item within a "Do" list. Renders a semantic
<li> element representing a guideline or best practice that users should
follow. Commonly used in design system documentation, style guides, and
instructional content to show approved patterns alongside DontListItem.

The component sets data-recommendation="do" for consumer styling hooks,
enabling visual differentiation (e.g. green checkmarks, success borders)
without embedding any styles itself.

## What it does

An encouraged-practice item in a do-list guideline list.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<DoListItem>Use semantic HTML elements</DoListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | The recommendation content. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Design system guideline list -->
<ul aria-label="Recommended practices">
  <DoListItem>Use descriptive alt text for images</DoListItem>
  <DoListItem>Provide visible focus indicators</DoListItem>
  <DoListItem>Use sufficient color contrast</DoListItem>
</ul>

<!-- Side-by-side do/don't pattern -->
<ul aria-label="Do">
  <DoListItem>Write clear error messages</DoListItem>
</ul>
<ul aria-label="Don't">
  <DontListItem>Use technical jargon in errors</DontListItem>
</ul>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import DoListItem from "$lib/components/DoListItem/DoListItem.svelte";
</script>

<DoListItem>Use semantic HTML elements</DoListItem>
```

## Keyboard

- None directly — passive informational display, not interactive

## Accessibility

- Semantic <li> element provides list item semantics within the parent list
- Screen readers announce list position from the parent <ul> or <ol>
- data-recommendation attribute provides a hook for consumer styling

## Internationalization

- All content is provided through the children snippet
- No hardcoded strings in the component

## References

- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- Material Design Do/Don't guidelines: https://m3.material.io/foundations/content-design/style-guide/overview
