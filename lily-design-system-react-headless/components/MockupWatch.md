# MockupWatch

A box area that looks like a smart watch. Renders a decorative `<div>` container the consumer styles to look like the named device.

## Props

- `className`: string (optional) -- CSS class name appended to `mockup-watch`
- `children`: ReactNode (required) -- content rendered inside the frame
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
<MockupWatch>
  <img src="screenshot.png" alt="App screen" />
</MockupWatch>
```

## References

- HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
