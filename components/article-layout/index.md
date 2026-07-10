# Article Layout

A top-level article wrapper that sets CSS custom properties for content column widths. ArticleLayout provides a semantic `<article>` element that establishes a system of named column widths for descendant ContentBlock components.

This headless component uses an `<article>` element with an optional `aria-label` to create a semantic article region.

## Implementation Notes

- Uses `<article>` element for semantic article content
- Sets CSS custom properties for column widths (--content-width-narrower: 330px, --content-width-narrow: 510px, --content-width-normal: 660px, --content-width-wide: 930px, --content-width-wider: 1200px)
- Consumer overrides column widths by setting custom properties
- Inspired by Reuters Graphics Article component

## Props

- `label`: string (optional) -- accessible label for the article
- `children`: slot (required) -- article content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<ArticleLayout>
  <Headline>...</Headline>
  <ContentBlock>...</ContentBlock>
</ArticleLayout>
```

```html
<ArticleLayout label="Annual report 2026">
  <ContentBlock width="narrow">
    <h1>Annual Report</h1>
    <p>Key findings from the year.</p>
  </ContentBlock>
  <ContentBlock width="wide">
    <img src="chart.png" alt="Revenue growth chart" />
  </ContentBlock>
</ArticleLayout>
```

## Keyboard Interactions

- None -- children handle their own keyboard interactions

## ARIA

- Implicit `article` role from `<article>` element
- Optional `aria-label` -- describes the article for screen readers

## When to Use

- Use as the top-level wrapper for long-form article or editorial content pages
- Use when you need a system of named column widths for varied content widths
- Use when building scrollytelling or data-driven article layouts

## When Not to Use

- Do not use for application layouts -- use GrailLayout instead
- Do not use for simple page wrappers that do not need column width management

## Headless

This component provides an `<article>` element with CSS custom properties for column widths, with zero visual styling. The consumer is responsible for all CSS including background, padding, typography, and responsive behavior.

## Styles

The consumer provides all CSS styling. The component renders with an `.article-layout` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `article-layout`
- Verify `aria-label` is applied when provided
- Verify CSS custom properties are set on the element
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Plan content at multiple column widths. Use narrower widths for reading text and wider widths for data visualizations and images.
- **Developers**: Override default column widths by setting CSS custom properties on the ArticleLayout element. Pair with ContentBlock components for width management.

## Related components

- `container` — a generic block-level content container
- `grail-layout` — a responsive web design structure with header, left aside, center main, right aside, footer

## References

- Reuters Graphics Article component
- WAI-ARIA article role
- Documentation: index.md
- CSS class: .article-layout in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/article-layout.html

---

Lily™ and Lily Design System™ are trademarks.
