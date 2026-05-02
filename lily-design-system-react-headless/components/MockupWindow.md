# MockupWindow

A box area that looks like a desktop window. Renders a decorative `<div>` container the consumer styles to look like the named device.

## Props

- `className`: string (optional) -- CSS class name appended to `mockup-window`
- `children`: ReactNode (required) -- content rendered inside the frame
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
<MockupWindow>
  <img src="screenshot.png" alt="App screen" />
</MockupWindow>
```

## References

- HTML div element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div
