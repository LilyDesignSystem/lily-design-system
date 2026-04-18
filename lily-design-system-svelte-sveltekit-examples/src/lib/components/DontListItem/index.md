# DontListItem

## Overview

A single discouraged-practice item within a "Don't" list. Renders a semantic
<li> element representing a guideline or practice that users should avoid.
Commonly used in design system documentation, style guides, and instructional
content to show anti-patterns alongside DoListItem.

The component sets data-recommendation="dont" for consumer styling hooks,
enabling visual differentiation (e.g. red crosses, danger borders) without
embedding any styles itself.

## What it does

A discouraged-practice item in a dont-list guideline list.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<DontListItem>Use vague placeholder text</DontListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | The discouraged-practice content. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Design system anti-pattern list -->
<ul aria-label="Practices to avoid">
  <DontListItem>Use color alone to convey meaning</DontListItem>
  <DontListItem>Remove focus outlines without replacement</DontListItem>
  <DontListItem>Rely solely on placeholder text as labels</DontListItem>
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
  import DontListItem from "$lib/components/DontListItem/DontListItem.svelte";
</script>

<DontListItem>Use vague placeholder text</DontListItem>
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
