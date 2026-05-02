# PaginationLink

One pagination link in the trail. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `className`: string (optional) -- CSS class name appended to `pagination-link`
- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- `children`: ReactNode (required) -- the link content
- `...restProps`: unknown -- additional attributes spread onto the `<a>`

## Usage

```tsx
<PaginationLink href="/destination">Link text</PaginationLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
