# SectionHeading

A styled heading introducing a major content section, with optional eyebrow and subtitle. Renders a semantic `<header>` containing an `<h2>` (or `h3`-`h6` if `level` is set) and optional surrounding paragraphs.

## Implementation Notes

- `heading` is **required**
- `level` chooses between `h2` (default), `h3`, `h4`, `h5`, or `h6`
- The eyebrow paragraph is rendered above the heading; the subtitle below
- Use this to introduce a section -- pair it with content immediately afterwards in a `<section>`

## Props

- `heading`: string (**required**)
- `level`: `2 | 3 | 4 | 5 | 6` (default `2`)
- `eyebrow`: string (optional)
- `subtitle`: string (optional)
- `className`: string (optional)
- `...restProps`: any additional HTML attributes passed to the `<header>`

## Usage

```tsx
<SectionHeading
  eyebrow="Features"
  heading="Why choose us"
  subtitle="A short, supporting tagline."
  level={2}
/>
```

## ARIA

- Semantic `<header>` element
- The chosen heading element (`h2`-`h6`) provides hierarchical semantics
