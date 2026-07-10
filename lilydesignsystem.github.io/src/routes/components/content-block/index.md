# Content Block

A content width constraint container with named column widths. ContentBlock constrains child content to a named column width, reading CSS custom properties set by an ArticleLayout parent.

This headless component uses a `<div>` element as a presentational container with no ARIA semantics.

## Implementation Notes

- Constrains child content to a named column width
- Reads CSS custom properties set by ArticleLayout parent
- `data-width` attribute reflects the current width for CSS targeting
- Centers content horizontally with auto margins
- Inspired by Reuters Graphics Block component

## Props

- `width`: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid" (default: "normal") -- content width
- `children`: slot (required) -- block content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ContentBlock width="narrow">
  <p>Narrow column text content.</p>
</ContentBlock>
<ContentBlock width="wide">
  <img src="chart.png" alt="Data visualization" />
</ContentBlock>
```

```html
<ArticleLayout>
  <ContentBlock width="narrower">
    <p>Very narrow sidebar content.</p>
  </ContentBlock>
  <ContentBlock>
    <p>Default normal-width body text.</p>
  </ContentBlock>
  <ContentBlock width="wider">
    <figure>
      <img src="panorama.jpg" alt="Landscape panorama" />
      <figcaption>A wide landscape image.</figcaption>
    </figure>
  </ContentBlock>
  <ContentBlock width="fluid">
    <div>Full-width content.</div>
  </ContentBlock>
</ArticleLayout>
```

## Keyboard Interactions

- None

## ARIA

- None -- presentational container

## When to Use

- Use inside ArticleLayout to constrain content to specific column widths
- Use when different content blocks need different widths on the same page
- Use for editorial layouts where text, images, and charts have different optimal widths

## When Not to Use

- Do not use outside of article or editorial layouts
- Do not use for application-level layout constraints -- use GrailLayout instead

## Headless

This component provides a `<div>` element with a `data-width` attribute, with zero visual styling. The consumer is responsible for all CSS including max-width, margins, padding, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with a `.content-block` class and a `data-width` attribute for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `content-block`
- Verify `data-width` attribute reflects the width prop
- Verify default width is "normal" when no width prop is provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use narrower widths (330px--510px) for body text to maintain optimal line length. Use wider widths for images, charts, and data visualizations.
- **Developers**: The `data-width` attribute allows CSS targeting for each width variant. Use CSS custom properties from the parent ArticleLayout to control actual widths.

## Related components

- `container` — a generic block-level content container
- `container-with-fluid-width` — a full-width content wrapper with horizontal padding

## References

- Reuters Graphics Block component
- Documentation: index.md
- CSS class: .content-block in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/content-block.html

---

Lily™ and Lily Design System™ are trademarks.
