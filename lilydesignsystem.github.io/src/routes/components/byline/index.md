# Byline

A byline is an author attribution with publish and update timestamps. It displays author names or links alongside machine-readable date information for article and editorial content.

This headless component uses a `<div>` element containing author attribution and optional `<time>` elements for publish and update timestamps.

## Implementation Notes

- Uses `<div>` element as container
- Displays author attribution as children
- Supports publish and update timestamps using `<time>` elements
- Author names can be plain text or links with `rel="author"`
- Inspired by Reuters Graphics Byline component

## Props

- `children`: slot (required) -- author names/links
- `published`: slot (optional) -- publish date/time
- `updated`: slot (optional) -- last updated date/time
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Byline>
  <a href="/author/jane-smith" rel="author">Jane Smith</a>
  <time slot="published" datetime="2026-04-15">April 15, 2026</time>
  <time slot="updated" datetime="2026-04-15">Updated April 15, 2026</time>
</Byline>
```

```html
<Byline>
  <a href="/author/jane-smith" rel="author">Jane Smith</a>,
  <a href="/author/john-doe" rel="author">John Doe</a>
  <time slot="published" datetime="2026-04-15T10:30:00Z">April 15, 2026, 10:30 AM</time>
</Byline>
```

```html
<Byline>
  Reuters Staff
  <time slot="published" datetime="2026-04-15">April 15, 2026</time>
</Byline>
```

## Keyboard Interactions

- None (links within are natively focusable)

## ARIA

- `<time datetime="">` for machine-readable dates
- `rel="author"` on author links

## When to Use

- Use for article or editorial author attribution
- Use when you need to display author names with publish and update timestamps
- Use in combination with Headline component for complete article headers

## When Not to Use

- Do not use for generic metadata display -- use SummaryList
- Do not use for commenting attribution -- use Comment component
- Do not use for non-editorial content attribution

## Headless

This component provides a `<div>` container for author attribution and timestamps, with zero visual styling. The consumer is responsible for all CSS including text formatting, spacing between author and dates, link styling, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.byline` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `byline`
- Verify children slot renders author attribution
- Verify published slot renders when provided
- Verify updated slot renders when provided
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep byline layout compact. Distinguish between publish and update dates visually. Consider how multiple authors display at different viewport widths.
- **Developers**: Always use `<time>` elements with `datetime` attributes for machine-readable dates. Use `rel="author"` on author links for structured data. Ensure date formats are localized for the target audience.

## Related components

- `review-date` — a display of a content review date
- `comment` — a comment displays user discussions and user feedback

## References

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

---

Lily™ and Lily Design System™ are trademarks.
