# StatusLight

A small colored dot status indicator paired with a status label.

## Implementation Notes

- Headless: no CSS
- Container `<span>` carries `role="status"`
- The dot is `aria-hidden` so screen readers only announce the label
- Variant is exposed via `data-variant` for consumer CSS

## Props

- `variant`: `"neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive"` (default `"neutral"`)
- `label`: string (**required**) — the status text (e.g., "Active")

## Usage

```vue
<StatusLight variant="positive" label="Active" />
<StatusLight variant="negative" label="Offline" />
```

## ARIA

- Container `role="status"`
- Dot `aria-hidden="true"`
- Accessible name comes from the visible label

## When to Use

- For inline at-a-glance status (e.g., "Active", "Pending", "Down")

## When Not to Use

- For interactive toggles — use `SwitchButton` or `ToggleButton`
- For numeric indicators — use `Badge`

## Headless

Semantic HTML and ARIA only. Consumers style the dot color via the `data-variant` attribute.

## Testing

- Verify root `status-light` class and `role="status"`
- Verify the label text renders
- Verify the dot is `aria-hidden`
- Verify `data-variant` defaults to `neutral` and reflects supplied variants

## References

- [Adobe Spectrum — Status Light](https://spectrum.adobe.com/page/status-light/)
