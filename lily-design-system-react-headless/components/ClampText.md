# ClampText

A text container that truncates content to a maximum number of visible lines while keeping the full text in the DOM for screen readers and copy/paste. The component sets `data-lines` and an inline `--clamp-text-lines` custom property; consumers apply the actual `line-clamp` / `-webkit-line-clamp` rules in their own CSS.

## Implementation Notes

- Pure layout primitive -- no overflow rules in the component itself
- Full content remains accessible (not visually hidden)
- `data-lines` attribute and `--clamp-text-lines` custom property exposed for consumer CSS
- Default lines value is 2

## Props

- `lines`: number (default: 2) -- maximum number of visible lines
- `label`: string (optional) -- aria-label for screen readers
- `children`: ReactNode (required) -- the text content
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<ClampText lines={3}>
  A long product description that should be truncated to three lines.
</ClampText>

<ClampText lines={2} label="Article excerpt">
  An article excerpt with screen-reader-friendly aria-label.
</ClampText>
```

## Keyboard Interactions

- None -- passive content container

## ARIA

- Optional `aria-label` via `label` prop
- Full text remains in the DOM, accessible to assistive technologies
