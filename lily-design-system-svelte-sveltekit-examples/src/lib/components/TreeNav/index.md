# TreeNav

## Overview

A headless tree-based menu that displays hierarchical or nested navigation
options using the ARIA tree role. Renders a <ul> with role="tree" and
provides keyboard navigation between tree items using ArrowDown/ArrowUp
with wrapping, plus Home/End to jump to first/last items. Commonly used
for file directories, multi-level category navigation, or organizational
charts.

## What it does

A hierarchical navigation with expandable branches.

## When to use

- Use to mark a region as primary navigation (landmark).

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TreeNav label="Navigation">...</TreeNav>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the tree via aria-label. |
| `children` | Snippet, required | Tree item elements (expected to be <li role="treeitem">). |
| `...restProps` | additional HTML attributes spread onto the <ul> |  |

## Examples

```svelte
<!-- Tree menu with navigable items -->
<TreeNav label="Navigation">
  <li role="treeitem" tabindex="-1">Home</li>
  <li role="treeitem" tabindex="-1">About</li>
  <li role="treeitem" tabindex="-1">Contact</li>
</TreeNav>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TreeNav from "$lib/components/TreeNav/TreeNav.svelte";
</script>

<TreeNav label="Navigation">...</TreeNav>
```

## Keyboard

- ArrowDown: move focus to the next tree item (wraps to first)
- ArrowUp: move focus to the previous tree item (wraps to last)
- Home: move focus to the first tree item
- End: move focus to the last tree item

## Accessibility

- role="tree" identifies the container as a tree view widget
- aria-label={label} provides an accessible name for the tree
- Consumer items should use role="treeitem" and tabindex="-1"

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/TreeList/
