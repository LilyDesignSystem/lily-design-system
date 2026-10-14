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

## Count

`countLabel` (with an optional `count`) shows a visible, localised count inside the link, after the text, so the link's
accessible name includes it; `count` sets `data-count` (and `data-complete` at 0). The count is text, never colour alone
(WCAG 1.4.1), and an `aria-label` replaces the whole name, so include the count in it if you set one.
See the canonical `components/contents-link/index.md`.
