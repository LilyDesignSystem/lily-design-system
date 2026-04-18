# ContentsListItem

## Overview

A headless list item for use within a table of contents or navigation list.
Renders a semantic <li> element that wraps consumer-provided content, typically
an anchor link to a page section. Supports nesting for hierarchical
document structures by placing a `<ol>` inside. Used as a child of
ContentsList or any ordered/ordered list in a navigation context.

## What it does

One contents list item.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<ContentsListItem><a href="#section">Section</a></ContentsListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | List item content (typically a link or nested list). |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Nested contents list items for subsections -->
<ContentsListItem>
  <a href="#section-3">Results</a>
  <ul>
    <ContentsListItem><a href="#section-3a">Data</a></ContentsListItem>
    <ContentsListItem><a href="#section-3b">Analysis</a></ContentsListItem>
  </ul>
</ContentsListItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import ContentsListItem from "$lib/components/ContentsListItem/ContentsListItem.svelte";
</script>

<ContentsListItem><a href="#section">Section</a></ContentsListItem>
```

## Keyboard

- None — keyboard interaction is handled by contained links or the parent list

## Accessibility

- Semantic <li> provides implicit listitem role
- Should be placed within a <ul> or <ol> parent for valid HTML structure
- Supports aria-current="page" or aria-current="true" on the <li> for current page indication

## Internationalization

- All content is provided through the children snippet; no hardcoded strings

## References

- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/menu/
