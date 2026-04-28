# StickyPromoBanner

A fixed-position promotional banner pinned to the top or bottom of the viewport, with an optional dismiss button. Renders an `<aside role="complementary">` with the sticky positioning applied via inline styles (the only documented exception to the headless "no inline styles" rule).

## Implementation Notes

- `label` and `dismissLabel` are **required**
- The dismiss button renders **only** when `onDismiss` is provided
- The banner uses inline `position: fixed; left: 0; right: 0;` plus `top: 0` or `bottom: 0` based on `position`
- Visibility is controlled via the native `hidden` attribute when `open` is `false`
- `position` is exposed as `data-position` for consumer styling

## Props

- `label`: string (**required**) -- `aria-label` for the aside region
- `dismissLabel`: string (**required**) -- `aria-label` for the dismiss button
- `open`: boolean (default `true`)
- `position`: `"top" | "bottom"` (default `"bottom"`)
- `onDismiss`: (event: React.MouseEvent<HTMLButtonElement>) => void (optional)
- `className`: string (optional)
- `children`: ReactNode (optional)
- `...restProps`: any additional HTML attributes passed to the `<aside>`

## Usage

```tsx
const [open, setOpen] = useState(true);

<StickyPromoBanner
  label="Subscription promotion"
  position="bottom"
  open={open}
  dismissLabel="Dismiss banner"
  onDismiss={() => setOpen(false)}
>
  <p>Subscribe and save 20% on your first order.</p>
  <a href="/subscribe">Subscribe</a>
</StickyPromoBanner>
```

## ARIA

- `<aside role="complementary">` landmark with `aria-label`
- Dismiss button has its own `aria-label` from `dismissLabel`
