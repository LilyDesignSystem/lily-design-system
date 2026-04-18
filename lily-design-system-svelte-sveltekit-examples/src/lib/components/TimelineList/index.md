# TimelineList

## Overview

A headless timeline list that renders a semantic ordered list (<ol>) with
an accessible label for displaying events, milestones, or activities in
chronological order. Commonly used for project tracking, activity feeds,
historical overviews, order history, or user journey visualization. The
consumer provides TimelineListItem children through the snippet.

## What it does

An ordered list of chronological events or milestones.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<TimelineList label="Project milestones">...</TimelineList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the timeline via aria-label. |
| `children` | Snippet, required | TimelineListItem elements. |
| `...restProps` | additional HTML attributes spread onto the <ol> |  |

## Examples

```svelte
<!-- Timeline with semantic time elements -->
<TimelineList label="Order history">
  <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    Order placed
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    Order shipped
  </TimelineListItem>
</TimelineList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TimelineList from "$lib/components/TimelineList/TimelineList.svelte";
</script>

<TimelineList label="Project milestones">...</TimelineList>
```

## Keyboard

- None directly -- standard list navigation by screen readers
- Tab moves focus between any interactive elements within items

## Accessibility

- Semantic <ol> element conveys chronological ordering to screen readers
- aria-label provides the accessible name for the timeline
- Screen readers announce the list with its label and item count
- Consumers should use <time> elements with datetime attributes

## Internationalization

- The label prop externalizes user-facing text for translation
- All timeline content is provided through the children snippet
- No hardcoded strings in the component

## References

- HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- WAI-ARIA list role: https://www.w3.org/TR/wai-aria-1.2/#list
