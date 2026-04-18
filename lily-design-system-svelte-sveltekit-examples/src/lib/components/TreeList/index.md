# TreeList

## Overview

A headless hierarchical list using the ARIA tree role with full keyboard
navigation. Renders a <ul> with role="tree" and manages focus movement
between tree items using ArrowDown/ArrowUp with wrapping, plus Home/End
to jump to first/last items. Commonly used for file browsers, organizational
charts, nested data displays, or any hierarchical structure.

## What it does

A hierarchical list with nested expandable items.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TreeList label="File browser">...</TreeList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name for the tree via aria-label. |
| `children` | Snippet, required | Tree item elements with role="treeitem". |
| `...restProps` | additional HTML attributes spread onto the <ul> |  |

## Examples

```svelte
<!-- File browser tree view -->
<TreeList label="File browser">
  <li role="treeitem" tabindex="0">Documents</li>
  <li role="treeitem" tabindex="-1">Photos</li>
  <li role="treeitem" tabindex="-1">Videos</li>
</TreeList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TreeList from "$lib/components/TreeList/TreeList.svelte";
</script>

<TreeList label="File browser">...</TreeList>
```

## Keyboard

- ArrowDown: move focus to the next tree item (wraps to first)
- ArrowUp: move focus to the previous tree item (wraps to last)
- Home: move focus to the first tree item
- End: move focus to the last tree item

## Accessibility

- role="tree" identifies the container as a tree widget for hierarchical data
- aria-label={label} provides an accessible name describing the tree

## Internationalization

- The label prop accepts any translated string
- No hardcoded user-facing strings

## References

- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/TreeList/
- WAI-ARIA tree role: https://www.w3.org/TR/wai-aria-1.2/#tree
