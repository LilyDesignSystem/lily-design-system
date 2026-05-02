# SuperBanner

A high-priority page-level banner that interrupts the user with a system-wide message. Rendered as a `<div role="alert" aria-live="assertive">` so assistive tech announces it immediately.

## Props

- `label`: string (optional) -- accessible label override (aria-label)
- `dismissable`: boolean (default false) -- show a dismiss button
- `dismissLabel`: string (default `"Dismiss"`) -- accessible label for the dismiss button
- default slot — banner content

## Emits

- `dismiss` — fired when the dismiss button is clicked

## Usage

```vue
<SuperBanner dismissable dismiss-label="Close" @dismiss="hide">
  Service is currently degraded. We are investigating.
</SuperBanner>
```

## References

- WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert
