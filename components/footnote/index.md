# Footnote

A footnote provides supplementary information, citations, or clarifications that support the main content without cluttering it. Footnotes are commonly used in articles, academic writing, legal documents, and documentation to reference sources, define terms, or add context.

This component renders as a semantic `<aside>` element with `role="note"`, giving screen readers clear indication that the content is supplementary. Each footnote is identified by a unique `id`, allowing in-page links from superscript reference markers in the main text to jump directly to the footnote.

## Implementation Notes

- Renders as `<aside>` with `role="note"` for semantic supplementary content
- The `id` prop serves double duty: it identifies the element for in-page linking and provides the `aria-label` value
- Accepts a `children` slot for flexible footnote content (text, links, citations)
- Spreads `restProps` onto the `<aside>` element for consumer customization

## Props

- `id`: string (required) -- unique footnote identifier, used for the element id and aria-label
- `children`: slot (required) -- footnote content to render inside the aside

## Usage

Simple footnote with a source reference:

```html
<Footnote id="fn1">Source: Example et al., 2024</Footnote>
```

Footnote linked from main content via superscript:

```html
<!-- In-page link from main content to footnote -->
<p>This claim is supported by research.<a href="#fn1"><sup>1</sup></a></p>

<!-- Footnote at the bottom of the page or section -->
<Footnote id="fn1">
  <a href="#ref1">1.</a> Example, A. (2024). <em>Research Title</em>. Journal Name.
</Footnote>
```

Multiple footnotes in a clinical guideline:

```html
<p>Blood pressure should be measured at every visit.<a href="#fn1"><sup>1</sup></a>
   Patients with readings above 140/90 mmHg require follow-up.<a href="#fn2"><sup>2</sup></a></p>

<Separator label="Footnotes" />

<Footnote id="fn1">
  <a href="#ref1">1.</a> NICE Guideline NG136: Hypertension in adults, 2019.
</Footnote>
<Footnote id="fn2">
  <a href="#ref2">2.</a> WHO Technical Report on Cardiovascular Disease Prevention, 2023.
</Footnote>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation is handled by any interactive elements placed inside the footnote by the consumer (such as links).

## ARIA

- `role="note"` -- indicates supplementary content that is related to the main content
- `aria-label="{id}"` -- provides an accessible name derived from the footnote identifier

## When to Use

- Use for citations, source references, or supplementary clarifications in articles, academic content, or legal documents.
- Use when the additional information should not interrupt the main content flow.
- Use in clinical guidelines, research papers, or policy documents to reference supporting evidence.
- Use for legal disclaimers or terms that need to be associated with specific claims in the text.

## When Not to Use

- Do not use for inline citations or bibliographic references -- use Citation instead.
- Do not use for general informational callouts -- use InsetText or InformationCallout instead.
- Do not use for critical information the user must read -- use Alert instead.

## Headless

This headless component provides an `<aside>` with `role="note"` and an `id` for in-page linking from superscript reference markers. The consumer provides all visual styling including indentation, font size, numbering, and separator lines.


## Styles

The consumer provides all CSS styling. The component renders with a `.footnote` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `footnote`
- Verify role="note"` -- indicates supplementary content that is related to the main content
- Verify aria-label="{id}"` -- provides an accessible name derived from the footnote identifier
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position footnotes at the bottom of the page or section with a clear visual separator. Use smaller text to distinguish footnotes from body content.
- **Developers**: Ensure the `id` prop matches the `href` fragment on the in-page link (e.g., `<a href="#fn1">`) for proper jump-to-footnote navigation.

## References

- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- MDN aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
