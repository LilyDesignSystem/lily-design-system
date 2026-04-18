# SummaryList

## Overview

A headless summary list that renders a semantic <dl> (description list)
element for presenting key-value pairs or summary information. Commonly
used for order summaries, account settings, form review data, or any
context requiring term-description pairs. The consumer provides content
through the children snippet, typically <dt>/<dd> pairs or SummaryListItem components.

## What it does

An ordered list of key-value summary pairs.

## When to use

- Use to render an ordered collection of related items.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<SummaryList label="Order summary">...</SummaryList>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible label for the description list via aria-label. |
| `children` | Snippet, required | List content, typically <dt>/<dd> pairs. |
| `...restProps` | additional HTML attributes spread onto the <dl> |  |

## Examples

```svelte
<!-- Key-value pair summary -->
<SummaryList label="Order summary">
  <dt>Product</dt><dd>Widget</dd>
  <dt>Quantity</dt><dd>3</dd>
  <dt>Total</dt><dd>$29.97</dd>
</SummaryList>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import SummaryList from "$lib/components/SummaryList/SummaryList.svelte";
</script>

<SummaryList label="Order summary">...</SummaryList>
```

## Keyboard

- None -- passive informational display, not interactive

## Accessibility

- Semantic <dl> element provides description list semantics
- aria-label on the dl provides screen reader context
- Screen readers announce the list and its term-description pairs

## Internationalization

- The label prop externalizes the accessible label string
- The children snippet allows localized content
- No hardcoded strings in the component

## References

- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- WAI-ARIA landmark regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
