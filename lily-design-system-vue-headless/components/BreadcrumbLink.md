# BreadcrumbLink

One breadcrumb link in the trail. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- default slot — the link content

## Usage

```vue
<BreadcrumbLink href="/destination">Link text</BreadcrumbLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
