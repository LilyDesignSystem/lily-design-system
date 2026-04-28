# Blockquote

A block-level quotation with an optional source citation. Renders a semantic `<blockquote>` element with an optional `cite` URL attribute and an optional visible attribution `<footer>`.

## Implementation Notes

- Uses a semantic `<blockquote>` element
- The `cite` prop sets the native `cite` attribute (a machine-readable source URL)
- The `citationText` prop sets the visible human-readable attribution rendered inside a `<footer>`
- The `label` prop sets `aria-label` for an accessible name override

## Props

- `className`: string (optional) -- additional CSS class names
- `cite`: string (optional) -- URL of the source
- `citationText`: string (optional) -- visible attribution text
- `label`: string (optional) -- `aria-label` override
- `children`: ReactNode (optional) -- the quotation content
- `...restProps`: any additional HTML attributes passed to the `<blockquote>`

## Usage

```tsx
<Blockquote
  cite="https://example.com/source"
  citationText="— Jane Doe, The Source"
>
  Quotation content goes here.
</Blockquote>
```

## ARIA

- Implicit `<blockquote>` semantics
- Optional `aria-label` from the `label` prop
