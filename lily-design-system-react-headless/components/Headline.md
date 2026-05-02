# Headline

A page or article headline composition: a heading at a configurable level (default `<h1>`), with optional subtitle (dek) and byline rendered below it.

## Props

- `className`: string (optional) — CSS class appended to `headline`
- `level`: `1 | 2 | 3 | 4 | 5 | 6` (default `1`) — heading level
- `children`: ReactNode (required) — heading text
- `subtitle`: ReactNode (optional) — subtitle / dek content
- `byline`: ReactNode (optional) — byline area
- `...restProps`: unknown — additional attributes spread onto the `<div>`

## Usage

```tsx
<Headline subtitle="A short dek" byline={<Byline>Jane Smith</Byline>}>
  Local council approves new funding
</Headline>
```

## References

- HTML heading elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
