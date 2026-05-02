# ContentsLink

One table of contents link. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- default slot — the link content

## Usage

```vue
<ContentsLink href="/destination">Link text</ContentsLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
