# ChatMessage

One chat conversation message entry.

## Props

- `className`: string (optional) -- CSS class appended to `chat-message`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<article>`

## Usage

```tsx
<ChatMessage>...</ChatMessage>
```

## References

- HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
