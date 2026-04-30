# Headline

A headline is a page headline with heading, subtitle, and byline area. It provides a structured container for article or editorial page titles with supporting subtitle (dek) and author attribution.

This headless component uses a `<div>` element containing a semantic heading element (`<h1>`-`<h6>`) at the specified level, with optional subtitle and byline slots.

## Implementation Notes

- Uses `<div>` container with a heading element at the specified level
- Default heading level is 1 (`<h1>`)
- Subtitle (dek) appears below the heading
- Byline slot for author/date attribution below the subtitle
- Inspired by Reuters Graphics Headline component

## Props

- `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 1) -- heading level
- `children`: slot (required) -- heading text content
- `subtitle`: slot (optional) -- subtitle/dek content below heading
- `byline`: slot (optional) -- byline area below subtitle
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Headline>
  Breaking: Major Policy Announcement
  <span slot="subtitle">Government reveals new plan</span>
  <Byline slot="byline">By Jane Smith</Byline>
</Headline>
```

```html
<Headline level="2">
  Economic Analysis
  <span slot="subtitle">Q1 results show steady growth across sectors</span>
</Headline>
```

```html
<Headline>
  The Future of Renewable Energy
  <span slot="subtitle">How wind and solar are transforming the grid</span>
  <Byline slot="byline">
    <a href="/author/jane-smith" rel="author">Jane Smith</a>
  </Byline>
</Headline>
```

## Keyboard Interactions

- None

## ARIA

- Heading role from semantic heading element (`<h1>`-`<h6>`)

## When to Use

- Use for article or editorial page headlines with subtitle and attribution
- Use when you need a structured headline with a dek/subtitle below the main heading
- Use in combination with Byline component for author attribution

## When Not to Use

- Do not use for section headings within body text -- use plain heading elements
- Do not use for navigation headings -- use the appropriate navigation component
- Do not use when only a simple heading is needed without subtitle or byline

## Headless

This component provides a `<div>` container with a semantic heading element, with zero visual styling. The consumer is responsible for all CSS including font sizes, spacing between heading, subtitle, and byline, text alignment, and responsive typography.

## Styles

The consumer provides all CSS styling. The component renders with a `.headline` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `headline`
- Verify the heading element matches the specified level (default `<h1>`)
- Verify subtitle slot renders below the heading when provided
- Verify byline slot renders below the subtitle when provided
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep headlines concise and scannable. Ensure subtitle text complements rather than repeats the headline. Consider responsive typography for different viewport sizes.
- **Developers**: Always use the appropriate heading level for the page hierarchy. Do not skip heading levels. Use the Byline component within the byline slot for consistent author attribution.

## Related components

- `hero` — a large box or image with a title and description
- `section-heading` — a styled heading introducing a major content section, with optional eyebrow and subtitle

## References

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
