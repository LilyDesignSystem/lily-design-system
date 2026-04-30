# Section Heading

A section heading is a `<header>` introducing a major content section.
It pairs the main heading with an optional eyebrow above and an optional
subtitle below, while letting the consumer choose the heading level
(`<h2>`–`<h6>`) to match document hierarchy.

Use it to introduce sections within a page, articles within a feed, or
panels within a dashboard.

## Implementation Notes

- Uses a native `<header>` element with class `section-heading`
- `heading` is **required** and renders as `<h{level}>` (default `<h2>`)
- `level` accepts `2 | 3 | 4 | 5 | 6` so the heading fits the surrounding outline
- `eyebrow` renders as a `<p class="section-heading-eyebrow">` above the heading
- `subtitle` renders as a `<p class="section-heading-subtitle">` below the heading
- No JavaScript behavior; the component is passive

## Props

- `heading`: string (**required**) -- main heading text
- `eyebrow`: string (optional) -- eyebrow text above the heading
- `subtitle`: string (optional) -- subtitle text below the heading
- `level`: 2 | 3 | 4 | 5 | 6 (default: 2) -- heading level
- `...restProps`: any additional HTML attributes

## Usage

Basic section heading:

```html
<SectionHeading heading="Our principles" />
```

With eyebrow and subtitle, h3 level:

```html
<SectionHeading
  level={3}
  eyebrow="Why Lily"
  heading="Designed for healthcare"
  subtitle="Patient-first, clinician-tested, accessible by default."
/>
```

## Keyboard Interactions

- None (passive element)

## ARIA

- Implicit `banner`-like grouping from `<header>` (note: `<header>` only acts as a banner landmark when it is a direct child of the `<body>`; inside a `<section>` or `<article>` it is just a generic header element)
- The heading element provides hierarchical document structure and is exposed via the heading role
- No additional ARIA needed; semantics come from the chosen heading element

## When to Use

- Use to introduce a section, article, or panel with consistent typography.
- Use when the section benefits from a small "eyebrow" label and/or a supporting subtitle.
- Use to maintain a clean heading outline by passing the appropriate `level`.

## When Not to Use

- Do not use for the page title — use a top-level `<h1>` directly.
- Do not use for body paragraphs that look like a heading; use the correct heading element.
- Do not skip heading levels (e.g., from `<h2>` to `<h4>`); pick the correct `level` to match the document outline.

## Headless

Renders a `<header>` containing optional eyebrow `<p>`, the chosen heading
element with the heading text, and an optional subtitle `<p>`. Visual
typography, spacing, alignment, and decorative treatments are entirely the
consumer's responsibility.

## Styles

Consumer CSS targets the `section-heading` class on the `<header>` and the
inner `section-heading-eyebrow`, `section-heading-heading`, and
`section-heading-subtitle` classes for fine-grained styling.

## Testing

- Verify the component renders a `<header>` element with class `section-heading`
- Verify the heading renders as `<h{level}>` matching the `level` prop (default `<h2>`)
- Verify the eyebrow renders as `<p class="section-heading-eyebrow">` only when provided
- Verify the subtitle renders as `<p class="section-heading-subtitle">` only when provided
- Verify `level` validation accepts only 2 through 6

## Advice

- **Designers**: Use the eyebrow to label the section's category or theme. Keep the subtitle short — it is supporting text, not a paragraph.
- **Developers**: Always pass the correct `level` to keep heading hierarchy intact (the page should have one `<h1>`; sections inside should be `<h2>`, subsections `<h3>`, and so on).

## Related components

- `headline` — see components.tsv
- `hero-headline` — see components.tsv
- `byline` — see components.tsv

## References

- MDN `<header>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header
- MDN Heading Elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
- WCAG 2.4.6 Headings and Labels: https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels
- Mozilla Protocol Design System: https://protocol.mozilla.org/
