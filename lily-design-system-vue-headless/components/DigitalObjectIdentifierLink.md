# DigitalObjectIdentifierLink

A permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source. Renders as a semantic `<a>` element with optional aria-label override.

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional) -- accessible label override via `aria-label`
- default slot — the link content

## Usage

```vue
<DigitalObjectIdentifierLink href="/destination">Link text</DigitalObjectIdentifierLink>
```

## References

- HTML a element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
