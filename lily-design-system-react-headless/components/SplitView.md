# SplitView

A two-panel resizable layout container with a draggable divider between them. Inspired by Adobe Spectrum's SplitView.

## Implementation Notes

- The two panels are passed via `primary` and `secondary` props (not `children`)
- The optional `divider` prop replaces the default separator
- The default separator has `role="separator"`, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `tabIndex={0}` for keyboard resize
- `data-orientation` and `data-split-percent` are exposed for consumer styling
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `label`: string (**required**) — aria-label for the container
- `orientation`: `"horizontal" | "vertical"` (default: `"horizontal"`)
- `primary`: ReactNode (**required**) — first panel content
- `secondary`: ReactNode (**required**) — second panel content
- `divider`: ReactNode (optional) — custom divider content
- `splitPercent`: number 0-100 (default: `50`) — initial split position as percentage
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<SplitView
  label="File browser"
  orientation="horizontal"
  splitPercent={30}
  primary={<FileTree />}
  secondary={<FilePreview />}
/>
```

## ARIA

- The default divider has `role="separator"`, `aria-orientation`, `aria-valuenow`/`min`/`max`, and `tabIndex={0}`

## References

- [Adobe Spectrum SplitView](https://spectrum.adobe.com/page/split-view/)
