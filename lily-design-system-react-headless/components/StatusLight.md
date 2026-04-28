# StatusLight

A small colored dot status indicator paired with a status label. Inspired by Adobe Spectrum's StatusLight.

## Implementation Notes

- Renders a `<span>` with `role="status"`
- The `variant` is exposed via `data-variant` for consumer styling (no built-in colors)
- The decorative dot is `aria-hidden="true"`; the label provides the accessible content
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `variant`: `"neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive"` (default: `"neutral"`)
- `label`: string (**required**) — the status text (e.g., `"Active"`, `"Offline"`)
- `...restProps`: any additional HTML attributes passed to the root `<span>`

## Usage

```tsx
<StatusLight variant="positive" label="Online" />
<StatusLight variant="negative" label="Offline" />
<StatusLight variant="notice" label="Warning" />
```

## ARIA

- `role="status"` on the container
- The dot is `aria-hidden`; the text label is the accessible content

## References

- [Adobe Spectrum StatusLight](https://spectrum.adobe.com/page/status-light/)
