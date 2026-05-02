# DialGroup

A labelled group container for one or more `Dial` components, rendered as a `<div role="group">` with an accessible label.

## Props

- `className`: string (optional) -- CSS class appended to `dial-group`
- `label`: string (required) -- accessible label for the group
- `children`: ReactNode (required) -- Dial components
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
<DialGroup label="Audio settings">
  <Dial label="Volume" value={50} />
  <Dial label="Treble" value={20} />
</DialGroup>
```

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
