# Hero

A large box or image section with a title and description.

## Props

- `className`: string (optional) -- CSS class appended to `hero`
- `label`: string (required) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<section>`

## Usage

```tsx
<Hero label="...">...</Hero>
```

## References

- HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
