# Diff

A side-by-side comparison container for two items, rendered as a `<div role="group">` with an accessible label.

## Props

- `className`: string (optional) -- CSS class appended to `diff`
- `label`: string (required) -- accessible name describing the comparison
- `children`: ReactNode (required) -- the two items being compared
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
<Diff label="Code comparison">
  <pre>old version</pre>
  <pre>new version</pre>
</Diff>
```

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
