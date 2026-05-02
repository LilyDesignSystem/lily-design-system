# Event

An event component containing event-related information.

## Props

- `className`: string (optional) -- CSS class appended to `event`
- `label`: string (optional) -- accessible label via `aria-label`
- `children`: ReactNode (required) -- component content
- `...restProps`: unknown -- additional attributes spread onto the `<article>`

## Usage

```tsx
<Event>...</Event>
```

## References

- HTML article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
