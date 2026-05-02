# Byline

Author attribution with optional publish and update timestamps. The component renders a `<div>` containing the authors (`children`) plus two optional slots (`published`, `updated`) that the consumer fills with `<time datetime="...">` elements for machine-readable dates.

## Props

- `className`: string (optional) — CSS class appended to `byline`
- `children`: ReactNode (required) — author names/links (use `rel="author"` on author anchors)
- `published`: ReactNode (optional) — publish date/time, typically a `<time datetime="...">`
- `updated`: ReactNode (optional) — last updated date/time, typically a `<time datetime="...">`
- `...restProps`: unknown — additional attributes spread onto the `<div>`

## Usage

```tsx
<Byline
  published={<time dateTime="2026-04-15">April 15, 2026</time>}
  updated={<time dateTime="2026-04-16">Updated April 16, 2026</time>}
>
  <a href="/author/jane-smith" rel="author">Jane Smith</a>
</Byline>
```

## References

- HTML time element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
