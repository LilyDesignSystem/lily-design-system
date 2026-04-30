# Blockquote

A blockquote is a block-level quotation rendered as a native `<blockquote>`
element. It optionally carries a source citation URL via the `cite` attribute
and visible attribution text rendered inside a `<footer>`.

Use it to set off extended quotations from surrounding prose, such as quoted
passages from articles, interviews, books, speeches, or testimonials.

## Implementation Notes

- Uses a native `<blockquote>` element for inherent quotation semantics
- `cite` prop maps to the native `cite` attribute (a URL identifying the source)
- `citationText` prop renders inside a `<footer class="blockquote-citation">` element
- `label` prop is optional and overrides the implicit accessible name via `aria-label`
- `children` provide the quoted content
- No JavaScript behavior; the component is passive

## Props

- `cite`: string (optional) -- URL of the source, rendered as `cite` attribute
- `citationText`: string (optional) -- visible attribution text in the footer
- `label`: string (optional) -- aria-label override
- `children`: slot -- the quoted content
- `...restProps`: any additional HTML attributes

## Usage

Basic blockquote with quoted content:

```html
<Blockquote>
  <p>The best way to predict the future is to invent it.</p>
</Blockquote>
```

Blockquote with citation and source URL:

```html
<Blockquote cite="https://example.com/source" citationText="— Alan Kay, 1971">
  <p>The best way to predict the future is to invent it.</p>
</Blockquote>
```

## Keyboard Interactions

- None (passive element)

## ARIA

- Implicit `blockquote` semantics from the `<blockquote>` element
- `aria-label` optional override of the accessible name
- The `cite` attribute references the source URL but is not surfaced to most assistive tech

## When to Use

- Use for extended quotations of one or more sentences, especially ones that warrant visual separation.
- Use when the quote has a known author or source you can attribute.
- Use to highlight customer testimonials and pull quotes within editorial layouts.

## When Not to Use

- Do not use for short inline quotations — use the `<q>` element instead.
- Do not use as a generic styled container — semantic meaning matters.

## Headless

Renders a native `<blockquote>` with optional `cite` and `aria-label` attributes,
and an optional `<footer>` containing attribution text. Visual treatment of
the quote, indentation, decorative quote marks, and footer styling are entirely
the consumer's responsibility.

## Styles

Consumer CSS targets the `blockquote` class on the root element and the
`blockquote-citation` class on the footer. Provide indentation, optional
decorative quote glyphs, and clear separation between the quote body and the
attribution.

## Testing

- Verify the component renders a `<blockquote>` element with class `blockquote`
- Verify the native `cite` attribute equals the `cite` prop when provided
- Verify the `<footer class="blockquote-citation">` element renders only when `citationText` is provided
- Verify `aria-label` is rendered when `label` is provided
- Verify children content is rendered inside the blockquote

## Advice

- **Designers**: Indent the quote body, use a clear typographic hierarchy between the quote and its attribution, and avoid relying on decorative quotation marks alone for meaning.
- **Developers**: Always supply `cite` (URL) and `citationText` (visible attribution) when the source is known. Keep visual quotation marks in CSS so screen readers do not announce them twice.

## Related components

- `citation` — a citation acknowledges the relevance of a work of another to the topic of discussion
- `inset-text` — indented text to distinguish it from surrounding content

## References

- MDN `<blockquote>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote
- HTML Living Standard — The blockquote element: https://html.spec.whatwg.org/multipage/grouping-content.html#the-blockquote-element
- Mozilla Protocol Design System: https://protocol.mozilla.org/
