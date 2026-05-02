# TreeLink

One link in the tree. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `className`: string (optional) -- CSS class name appended to `tree-link`
- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- `children`: ReactNode (required) -- the link content
- `...restProps`: unknown -- additional attributes spread onto the `<a>`

## Usage

```tsx
<TreeLink href="/destination">Link text</TreeLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
