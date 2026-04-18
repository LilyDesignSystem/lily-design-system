# Footnote

A footnote provides supplementary information, citations, or clarifications that support the main content without cluttering it. Footnotes are commonly used in articles, academic writing, legal documents, and documentation to reference sources, define terms, or add context.

This component renders as a semantic `<aside>` element with `role="note"`, giving screen readers clear indication that the content is supplementary. Each footnote is identified by a unique `id`, allowing in-page links from superscript reference markers in the main text to jump directly to the footnote.

## Implementation Notes

- Renders as `<aside>` with `role="note"` for semantic supplementary content
- The `id` prop serves double duty: it identifies the element for in-page linking and provides the `aria-label` value
- Accepts a `children` Snippet for flexible footnote content (text, links, citations)
- Spreads `restProps` onto the `<aside>` element for consumer customization

## Props

- `id`: string (required) -- unique footnote identifier, used for the element id and aria-label
- `children`: Snippet (required) -- footnote content to render inside the aside

## Usage

```svelte
<Footnote id="fn1">Source: Example et al., 2024</Footnote>
```

```svelte
<!-- In-page link from main content to footnote -->
<p>This claim is supported by research.<a href="#fn1"><sup>1</sup></a></p>

<!-- Footnote at the bottom of the page or section -->
<Footnote id="fn1">
  <a href="#ref1">1.</a> Example, A. (2024). <em>Research Title</em>. Journal Name.
</Footnote>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by any interactive elements placed inside the footnote by the consumer (such as links).

## ARIA

- `role="note"` -- indicates supplementary content that is related to the main content
- `aria-label="{id}"` -- provides an accessible name derived from the footnote identifier

## References

- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- MDN aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
