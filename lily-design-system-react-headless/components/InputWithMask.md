# InputWithMask

A text input that displays a format mask placeholder (such as `(___) ___-____` for a phone number) which the user fills in. Inspired by the USWDS Input mask component.

## Implementation Notes

- Root element is `<div>` exposing `data-mask` for consumer CSS/JS
- Mask is rendered in a decorative `<span aria-hidden="true">` so consumers can position it as an overlay
- The accessible name comes from the input's required `aria-label`
- `label` and `mask` are non-optional

## Props

- `label`: string (**required**) — `aria-label` for the input
- `mask`: string (**required**) — format mask (e.g., `(___) ___-____`)
- `value`: string (default `""`) — input value
- `placeholder`: string (optional) — HTML placeholder
- `disabled`: boolean (default `false`)
- `onInput`: `(event: React.FormEvent<HTMLInputElement>) => void` (optional)
- `className`: string (optional) — appended after the root `input-with-mask` class
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
const [phone, setPhone] = useState("");

<InputWithMask
  label="Phone number"
  mask="(___) ___-____"
  value={phone}
  onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
/>;
```

## ARIA

- `aria-label` on the `<input>` is the accessible name
- The mask `<span>` is decorative (`aria-hidden="true"`)
- `data-mask` attribute on the root exposes the mask string for consumer styling

## References

- [USWDS Input mask](https://designsystem.digital.gov/components/input-mask/)
