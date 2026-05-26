# Body Text

A body text is a rendered text block within a content width container. It wraps article body content for consistent typography targeting by the consumer's stylesheet.

This headless component uses a `<div>` element to wrap body text content such as paragraphs, lists, and other block-level elements.

## Implementation Notes

- Uses `<div>` element as container
- Wraps body text content for consistent typography targeting
- Consumer applies typography styles via `.body-text` class
- Intended to be used inside ContentBlock for width constraint
- Inspired by Reuters Graphics BodyText component

## Props

- `children`: slot (required) -- text content (paragraphs, lists, etc.)
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ContentBlock width="normal">
  <BodyText>
    <p>First paragraph of article body text.</p>
    <p>Second paragraph with more detail.</p>
  </BodyText>
</ContentBlock>
```

```html
<BodyText>
  <p>The research findings indicate a significant shift in consumer behavior
  over the past decade.</p>
  <ul>
    <li>Online purchases increased by 45%</li>
    <li>In-store visits declined by 20%</li>
  </ul>
  <p>These trends are expected to continue into the next quarter.</p>
</BodyText>
```

```html
<BodyText>
  <p>Healthcare providers across the region reported improved patient outcomes
  following the implementation of the new protocol.</p>
  <blockquote>
    <p>"The results exceeded our expectations," said Dr. Smith.</p>
  </blockquote>
</BodyText>
```

## Keyboard Interactions

- None

## ARIA

- None -- semantic content comes from child elements (`<p>`, `<ul>`, `<ol>`, `<blockquote>`, etc.)

## When to Use

- Use for article body text that needs consistent typography styling
- Use inside editorial layouts to wrap running text content
- Use in combination with ContentBlock for width-constrained body text

## When Not to Use

- Do not use for standalone headings or captions -- use Headline or Caption
- Do not use for navigation or interactive content
- Do not use for short inline text -- this is for block-level body content

## Headless

This component provides a `<div>` container for body text content, with zero visual styling. The consumer is responsible for all CSS including font family, font size, line height, paragraph spacing, list styling, blockquote formatting, and responsive typography.

## Styles

The consumer provides all CSS styling. The component renders with a `.body-text` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `body-text`
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use appropriate line height and measure (characters per line) for readability. Ensure sufficient contrast between text and background. Consider responsive font sizing.
- **Developers**: Use semantic HTML elements within BodyText (paragraphs, lists, blockquotes). Do not nest BodyText components. Pair with ContentBlock for width constraint.

## Related components

- `blockquote` — a block-level quotation with optional source citation
- `section-heading` — a styled heading introducing a major content section, with optional eyebrow and subtitle

## References

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
