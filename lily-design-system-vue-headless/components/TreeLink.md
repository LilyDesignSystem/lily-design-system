# TreeLink

One link in the tree. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- default slot — the link content

## Usage

```vue
<TreeLink href="/destination">Link text</TreeLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
