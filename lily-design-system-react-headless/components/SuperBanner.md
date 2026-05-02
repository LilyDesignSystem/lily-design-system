# SuperBanner

A high-priority page-level banner that interrupts the user with a system-wide message. Rendered as a `<div role="alert" aria-live="assertive">` so assistive tech announces it immediately.

## Props

- `className`: string (optional) -- CSS class appended to `super-banner`
- `label`: string (optional) -- accessible label override (aria-label)
- `dismissable`: boolean (default false) -- show a dismiss button
- `onDismiss`: () => void (optional) -- called when the dismiss button is clicked
- `dismissLabel`: string (default `"Dismiss"`) -- accessible label for the dismiss button
- `children`: ReactNode (required) -- banner content
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Usage

```tsx
<SuperBanner dismissable dismissLabel="Close" onDismiss={hide}>
  Service is currently degraded. We are investigating.
</SuperBanner>
```

## References

- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
