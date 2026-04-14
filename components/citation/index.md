# Citation

A citation acknowledges the relevance of a work of another to the topic of discussion. It is used to reference books, articles, papers, websites, and other sources in academic, legal, journalistic, and general content contexts.

This headless component uses the native HTML `<cite>` element for inherent citation semantics. The `<cite>` element represents the title of a creative work and is typically rendered in italics by browsers.

## Implementation Notes

- Renders a `<cite>` element for citation semantics
- Consumer provides the citation text as children
- The `<cite>` element should contain the title of the referenced work
- Spreads `restProps` onto the `<cite>` for consumer customization

## Props

- `children`: slot (required) -- citation text, typically the title of the referenced work
- `...restProps`: unknown -- additional attributes spread onto the `<cite>` element

## Usage

Basic citation:

```html
<Citation>The Elements of Style</Citation>
```

Citation within a blockquote:

```html
<blockquote>
  <p>The only way to do great work is to love what you do.</p>
  <footer>-- Steve Jobs, <Citation>Stanford Commencement Address</Citation></footer>
</blockquote>
```

Citation with a link:

```html
<Citation><a href="https://example.com/paper">A Study on Accessibility</a></Citation>
```

## Keyboard Interactions

- None (passive inline element)
- If the citation contains a link, standard link keyboard interactions apply (Tab to focus, Enter to activate)

## ARIA

- Implicit semantics from the `<cite>` element
- No additional ARIA attributes required for standard usage
- Screen readers announce the content as a citation reference

## When to Use

- Use to acknowledge the relevance of another work, such as a research paper, clinical guideline, or regulatory document.
- Use for referencing the title of a creative work such as a book, article, paper, film, or website.
- Use within blockquotes to attribute the source of a quotation.
- Use in bibliographies, reference lists, and evidence-based content.

## When Not to Use

- Do not use for general hyperlinks -- use ActionLink or a standard anchor element.
- Do not use for digital object identifiers -- use DigitalObjectIdentifierLink for DOI permanent links.
- Do not use for quoting text content directly -- use `<blockquote>` or `<q>` instead.
- Do not use for author names alone -- `<cite>` is intended for work titles, not person names.

## Headless

This component provides a `<cite>` element with citation semantics and zero visual styling. The consumer is responsible for all CSS including font style (italic or normal), color, and any decorative styling for citations.

## Styles

The consumer provides all CSS styling. The component renders with a `.citation` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<cite>` element with class `citation`
- Verify implicit citation semantics from the `<cite>` element
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider using italic styling to visually distinguish citations from surrounding text. Ensure citations within blockquotes are clearly associated with the quoted content.
- **Developers**: Use `<cite>` for work titles only, not for author names. Combine with `<a>` elements when the citation should link to the referenced source.

## References

- MDN HTML cite element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite
