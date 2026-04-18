# SummaryListItem

## Overview

A single key-value row within a SummaryList (<dl>). Renders a <div> wrapper
containing a <dt> (term) and <dd> (description) pair. The HTML spec permits
<div> as a direct child of <dl> for grouping dt/dd pairs, enabling per-row
styling and attribute targeting without breaking list semantics.

## What it does

One key-value pair in a summary list.

## When to use

- Use as a child of the matching list component — never standalone.

## When not to use

- Do not use outside its parent list component.

## Usage

```svelte
<SummaryListItem term="Label">Value</SummaryListItem>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `term` | string, required | The key/label text rendered in the <dt> element. |
| `children` | Snippet, required | The value/description content rendered in the <dd>. |
| `...restProps` | additional HTML attributes spread onto the wrapper <div> |  |

## Examples

```svelte
<!-- Order summary with term-description pairs -->
<SummaryList label="Order summary">
  <SummaryListItem term="Product">Widget</SummaryListItem>
  <SummaryListItem term="Quantity">3</SummaryListItem>
  <SummaryListItem term="Total">$29.97</SummaryListItem>
</SummaryList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SummaryListItem from "$lib/components/SummaryListItem/SummaryListItem.svelte";
</script>

<SummaryListItem term="Label">Value</SummaryListItem>
```

## Keyboard

- None -- passive informational display, not interactive

## Accessibility

- Semantic <dt> and <dd> elements provide description list semantics
- Screen readers announce term-description pairs naturally
- The <div> wrapper is transparent to assistive technology

## Internationalization

- The term prop externalizes the key/label string for translation
- The children snippet allows localized description content
- No hardcoded strings in the component

## References

- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- MDN dt element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
- MDN dd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
- HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
