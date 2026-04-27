# InputWithMask

An input displaying a format mask placeholder for the user to fill in (e.g., `(___) ___-____` for a phone number). The mask is rendered as a decorative `aria-hidden` span and is also exposed via `data-mask` on the root for CSS overlays.

## Implementation Notes

- Headless: no CSS, no styles
- `label` and `mask` are **required**
- The mask `<span aria-hidden="true">` appears before the `<input>` in DOM order
- Accessibility relies on the input's `aria-label` (the mask is decorative)

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `mask`: string (**required**) — format mask text
- `value`: string (default `""`)
- `placeholder`: string (optional)
- `disabled`: boolean (default `false`)

## Events

- `input(event: Event)` — fired on every input change

## Usage

```vue
<InputWithMask
    label="Phone number"
    mask="(___) ___-____"
    :value="phone"
    @input="onInput"
/>
```

## ARIA

- `aria-label` on the input is the entire accessible name
- The mask display is `aria-hidden="true"` (decorative)

## Headless

The component does not implement masked typing logic; it provides the visual structure and accessible input. Consumers wire up masking behavior in their own state.

## Testing

- Verify root `input-with-mask` class
- Verify `data-mask` attribute mirrors the mask prop
- Verify the mask span is aria-hidden and renders before the input
- Verify the input has aria-label, value, placeholder, and disabled
- Verify the `input` event fires when the user types

## References

- [USWDS Input mask](https://designsystem.digital.gov/components/input-mask/)
