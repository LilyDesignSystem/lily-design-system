# TreeMenu

A hierarchical tree menu with expandable branches.

## Props

- `className`: string (optional) -- CSS class appended to `tree-menu`
- `label`: string (required) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
<TreeMenu label="...">...</TreeMenu>
```

## References

- HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
