# ThemePickerButton

One button in a theme picker, representing a single theme. Rendered as a `<button>` with `aria-pressed` reflecting whether this theme is currently active.

## Props

- `className`: string (optional) -- CSS class appended to `theme-picker-button`
- `label`: string (required) -- accessible label describing the theme
- `pressed`: boolean (default false) -- whether this theme is currently selected
- `disabled`: boolean (default false) -- whether the button is disabled
- `onClick`: MouseEventHandler (optional) -- click handler
- `children`: ReactNode (optional) -- button content (icon, swatch, label)
- `...restProps`: unknown -- additional attributes spread onto the `<button>`

## Usage

```tsx
<ThemePickerButton
  label="Light theme"
  pressed={theme === "light"}
  onClick={() => setTheme("light")}
/>
```

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
