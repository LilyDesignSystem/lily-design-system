# Diff

A side-by-side comparison container for two items, rendered as a `<div role="group">` with an accessible label.

## Props

- `label`: string (required) -- accessible name describing the comparison
- default slot — the two items being compared

## Usage

```vue
<Diff label="Code comparison">
  <pre>old version</pre>
  <pre>new version</pre>
</Diff>
```

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
