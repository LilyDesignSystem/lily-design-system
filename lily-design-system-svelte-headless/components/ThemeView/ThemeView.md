# ThemeView

ThemeView is a headless component that displays the current theme name as inline text. It renders the theme value in a `<span>` element with an accessible label, making the current theme selection readable by screen readers.

This component is commonly paired with ThemePicker in an Input/View pattern. While ThemePicker allows the user to select a theme, ThemeView displays the currently active theme. It is useful in settings panels, status bars, or anywhere the current theme needs to be communicated visually and programmatically.

## Implementation Notes

- Renders a `<span>` element containing the theme value as text content
- Uses `aria-label` to provide an accessible name for the displayed value
- Both `label` and `value` are required props
- Spreads `restProps` onto the span for consumer customization
- Svelte 5 pattern: standard `$props()` destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the display element via `aria-label`
- `value`: string (required) -- the current theme name to display as text content
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

```svelte
<ThemeView label="Current theme" value="dark" />
```

## Keyboard Interactions

None -- this component is a passive display element with no interactive behavior.

## ARIA

- `aria-label={label}` -- provides an accessible name describing what the displayed value represents

## References

- WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/
