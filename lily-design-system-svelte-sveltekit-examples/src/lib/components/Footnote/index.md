# Footnote

## Overview

A footnote provides supplementary information, citations, or clarifications that
support the main content without cluttering it. Commonly used in articles, academic
writing, legal documents, and documentation. Renders as a semantic <aside> element
with role="note", and each footnote is identified by a unique id for in-page linking.

## What it does

A footnote reference and content element.

## When to use

- Use when you need a footnote reference and content element.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<Footnote id="fn1">Source: Example et al., 2024</Footnote>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `id` | string, required | Unique footnote identifier, used for element id and aria-label. |
| `children` | Snippet, required | Footnote content (text, links, citations). |
| `...restProps` | additional HTML attributes spread onto the aside element |  |

## Examples

```svelte
<!-- Simple citation footnote -->
<Footnote id="fn1">Source: Example et al., 2024</Footnote>

<!-- In-page link from main content to footnote -->
<p>This claim is supported by research.<a href="#fn1"><sup>1</sup></a></p>
<Footnote id="fn1">
  <a href="#ref1">1.</a> Example, A. (2024). Research Title. Journal Name.
</Footnote>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Footnote from "$lib/components/Footnote/Footnote.svelte";
</script>

<Footnote id="fn1">Source: Example et al., 2024</Footnote>
```

## Keyboard

- None — this is a passive container; keyboard navigation handled by interactive child elements

## Accessibility

- role="note" indicates supplementary content related to the main content
- aria-label provides an accessible name derived from the footnote identifier
- The id attribute enables in-page linking from superscript reference markers

## Internationalization

- All content comes through the children snippet; no hardcoded user-facing strings
- The id prop is used as the aria-label; consumers should use meaningful identifiers

## References

- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- MDN aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
