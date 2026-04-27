# Statistic

A numeric value display with title, optional prefix (e.g. currency symbol), and optional suffix (e.g. unit or `%`). The value is supplied pre-formatted -- the consumer is responsible for number formatting and locale.

## Implementation Notes

- `title` and `value` are non-optional
- `prefix` and `suffix` are `ReactNode` props (so the consumer can pass strings, glyphs, icons, etc.)
- `aria-label` defaults to `"{title}: {value}"` and can be overridden via the `label` prop

## Props

- `title`: string (**required**)
- `value`: string (**required**) -- pre-formatted value text
- `prefix`: ReactNode (optional)
- `suffix`: ReactNode (optional)
- `label`: string (optional) -- overrides the auto aria-label
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<Statistic title="Revenue" value="123,456" prefix="$" suffix="USD" />

<Statistic title="Conversion" value="98.7" suffix="%" />
```

## Keyboard Interactions

None -- read-only display.

## ARIA

- `role="group"` on the root
- `aria-label` either consumer-supplied or auto-composed as `"{title}: {value}"`
