# ThemePickerButton

One button in a theme picker, representing a single theme. Rendered as a `<button>` with `aria-pressed` reflecting whether this theme is currently active.

## Props

- `label`: string (required) -- accessible label describing the theme
- `pressed`: boolean (default false) -- whether this theme is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- default slot — button content (icon, swatch, label)

## Emits

- `click` — native click event

## Usage

```vue
<ThemePickerButton
  label="Light theme"
  :pressed="theme === 'light'"
  @click="theme = 'light'"
/>
```

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
