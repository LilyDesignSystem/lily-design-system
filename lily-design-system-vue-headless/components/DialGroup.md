# DialGroup

A labelled group container for one or more `Dial` components, rendered as a `<div role="group">` with an accessible label.

## Props

- `label`: string (required) -- accessible label for the group
- default slot — Dial components

## Usage

```vue
<DialGroup label="Audio settings">
  <Dial label="Volume" :value="50" />
  <Dial label="Treble" :value="20" />
</DialGroup>
```

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
