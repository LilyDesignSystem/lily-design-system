# CodeBlock

A block of formatted code with optional line numbers and line highlighting.

## Props

- `className`: string (optional) -- CSS class appended to `code-block`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<pre>`

## Usage

```tsx
<CodeBlock>...</CodeBlock>
```

## References

- HTML pre element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre
