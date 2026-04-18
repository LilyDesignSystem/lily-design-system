# TimelineListItem

## Overview

A single event entry within a TimelineList ordered list. Renders a semantic
<li> element containing an optional <time> element for machine-readable dates
and an optional heading, followed by descriptive content via children. Used
for project milestones, activity feeds, order histories, or any chronological
sequence of events.

## What it does

One event in a timeline list.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<TimelineListItem datetime="2024-01-15" heading="Jan 15">Event description</TimelineListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `datetime` | string, optional | ISO date/time string for the <time> element. |
| `heading` | string, optional | Visible date/time text rendered inside the <time> element. |
| `children` | Snippet, required | Event description content. |
| `...restProps` | additional HTML attributes spread onto the <li> |  |

## Examples

```svelte
<!-- Timeline entries inside a TimelineList -->
<TimelineList label="Order history">
  <TimelineListItem datetime="2024-01-15" heading="January 15, 2024">
    Order placed
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-16" heading="January 16, 2024">
    Order shipped
  </TimelineListItem>
  <TimelineListItem datetime="2024-01-19" heading="January 19, 2024">
    Order delivered
  </TimelineListItem>
</TimelineList>

<!-- Timeline entry without a date -->
<TimelineListItem>Status pending review</TimelineListItem>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import TimelineListItem from "$lib/components/TimelineListItem/TimelineListItem.svelte";
</script>

<TimelineListItem datetime="2024-01-15" heading="Jan 15">Event description</TimelineListItem>
```

## Keyboard

- None directly -- standard list item with no interactive behavior

## Accessibility

- Semantic <li> element provides list item semantics within the parent <ol>
- <time> element with datetime attribute provides machine-readable date
- Screen readers announce list position (e.g. "2 of 4") from the parent <ol>

## Internationalization

- The heading prop accepts any translated date/time string
- All content is provided through the children snippet
- No hardcoded strings in the component

## References

- HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
- WAI-ARIA listitem role: https://www.w3.org/TR/wai-aria-1.2/#listitem
