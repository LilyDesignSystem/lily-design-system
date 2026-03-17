# Northern Ireland Health And Care Number View

NorthernIrelandHealthAndCareNumberView is a read-only display of a Northern Ireland Health and Care (H&C) Number, the unique national healthcare identifier. It renders the value as inline text inside a `<span>` with `aria-label`. It is the display-only companion to NorthernIrelandHealthAndCareNumberInput.

## Implementation Notes

- Renders a `<span>` with `aria-label`
- Displays the value as text content
- Companion to NorthernIrelandHealthAndCareNumberInput

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- the H&C Number to display
- `...restProps`: any -- spread onto the `<span>`

## Usage

```html
<NorthernIrelandHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

- `aria-label={label}` -- provides accessible name

## When to Use

- Use for read-only display of a Northern Ireland H&C Number.
- Use NorthernIrelandHealthAndCareNumberInput for editable entry.

## Headless

This headless component provides a `<span>` with `aria-label`. Consumer provides all styling.

## Styles

Consumer provides all CSS. Class: `.northern-ireland-health-and-care-number-view`.

## Testing

- Verify renders `<span>` with correct class and aria-label
- Verify value displayed as text content

## Domain Knowledge

The Northern Ireland Health and Care (H&C) Number is a 10-digit numeric identifier, often displayed in a 3-3-4 format (e.g. 320 000 0001). The first two digits are always between 32 and 39.

## References

- HSC NI: https://online.hscni.net/
