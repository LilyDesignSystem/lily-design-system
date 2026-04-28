# SectionHeading

A styled heading introducing a major content section, with optional eyebrow and subtitle. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no styles
- Renders a `<header>` with optional eyebrow paragraph, a configurable heading element (`<h2>`–`<h6>`), and optional subtitle paragraph
- `heading` is **required** and non-optional in the TypeScript interface
- `level` selects the heading element so consumers can match the document outline

## Props

- `heading`: string (**required**) — main heading text
- `eyebrow`: string (optional) — eyebrow text rendered above the heading
- `subtitle`: string (optional) — subtitle text rendered below the heading
- `level`: `2 | 3 | 4 | 5 | 6` (default `2`) — heading level (renders `<h2>`–`<h6>`)

## Usage

```vue
<SectionHeading
    eyebrow="GET STARTED"
    heading="Build a privacy-first product"
    subtitle="Tools and resources to help you ship faster."
    :level="2"
/>
```

## ARIA

- Implicit `<header>` semantics
- The heading element provides hierarchical document semantics

## When to Use

- Introducing a major content section on a marketing or content page
- Anywhere a multi-line heading benefits from eyebrow and subtitle text

## When Not to Use

- Page-level headlines with bylines — use `Headline`
- Compact card or tile headings — use a plain `<h3>` inside the card

## Headless

The component renders a native `<header>` with semantic heading and paragraph children. Consumers supply all visual styling.

## Testing

- Verify the root `section-heading` class
- Verify the heading renders at the requested level
- Verify eyebrow and subtitle render conditionally
- Verify the order: eyebrow, heading, subtitle

## References

- [Mozilla Protocol Design System](https://protocol.mozilla.org)
- [MDN - Heading elements](https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements)
