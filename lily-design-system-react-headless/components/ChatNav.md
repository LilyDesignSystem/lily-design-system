# ChatNav

A navigation container for chat information.

## Props

- `className`: string (optional) -- CSS class appended to `chat-nav`
- `label`: string (required) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<nav>`

## Usage

```tsx
<ChatNav label="...">...</ChatNav>
```

## References

- HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
