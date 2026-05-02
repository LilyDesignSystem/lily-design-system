# ContentsLink

One table of contents link. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `className`: string (optional) -- CSS class name appended to `contents-link`
- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- `children`: ReactNode (required) -- the link content
- `...restProps`: unknown -- additional attributes spread onto the `<a>`

## Usage

```tsx
<ContentsLink href="/destination">Link text</ContentsLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
