# ScreenReaderSpan

A visually hidden span of text intended for screen readers.

## Props

- `className`: string (optional) -- CSS class appended to `screen-reader-span`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<span>`

## Usage

```tsx
<ScreenReaderSpan>...</ScreenReaderSpan>
```

## References

- HTML span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
