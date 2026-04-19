# Details

## Overview

A disclosure widget that reveals or hides additional content on demand.
Built on the native HTML <details> and <summary> elements, it provides
progressive disclosure with built-in browser accessibility. Common use
cases include FAQs, collapsible sections, and supplementary explanations.

## What it does

A disclosure widget that shows and hides content.

## When to use

- Use when you need a disclosure widget that shows and hides content.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Details summary="More info">Content here</Details>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `summary` | string, required | Text displayed in the clickable summary toggle. |
| `open` | boolean, default false | Whether the details section is expanded; bindable. |
| `children` | Snippet, required | Content revealed when expanded. |
| `...restProps` | additional HTML attributes spread onto the <details> element |  |

## Examples

```svelte
<!-- Basic disclosure -->
<Details summary="More information">
  <p>Additional details shown when expanded.</p>
</Details>

<!-- Two-way binding with parent state -->
<Details summary="Advanced options" bind:open={showAdvanced}>
  <p>Configure advanced settings here.</p>
</Details>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Details from "$lib/components/Details/Details.svelte";
</script>

<Details summary="More info">Content here</Details>
```

## Keyboard

- Enter: toggles the disclosure open/closed when <summary> is focused
- Space: toggles the disclosure open/closed when <summary> is focused

## Accessibility

- Native <details>/<summary> provide built-in ARIA semantics
- Browser automatically exposes expanded/collapsed state to assistive technology
- No additional ARIA attributes needed

## Internationalization

- The summary prop accepts any string; consumers provide localized text

## References

- MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
