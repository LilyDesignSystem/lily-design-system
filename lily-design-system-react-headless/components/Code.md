# Code

An inline code span for short code snippets within surrounding text.

## Props

- `className`: string (optional) -- CSS class appended to `code`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<code>`

## Usage

```tsx
<Code>...</Code>
```

## References

- HTML code element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code
