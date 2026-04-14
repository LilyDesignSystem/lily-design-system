# ThemePickerButton

A theme picker button is a button for selecting a visual theme within a ThemePicker component. Each button represents one theme option and shows a preview or label for that theme.

This headless component uses a `<button>` element with `aria-pressed` to indicate the currently selected theme, following the toggle button pattern within a picker group.

## Implementation Notes

- Uses `<button>` element for native keyboard and accessibility support
- `aria-pressed` indicates whether this theme is currently selected
- `aria-label` describes the theme this button represents
- Part of the ThemePicker composition pattern

## Props

- `pressed`: boolean (default: false) -- whether this theme is currently selected
- `label`: string (required) -- accessible label describing the theme
- `disabled`: boolean (default: false) -- whether the button is disabled
- `onclick`: callback (optional) -- click handler for theme selection
- `children`: slot -- button content (theme preview, label, swatch)
- `...restProps`: Any additional HTML attributes

## Usage

Basic theme picker with light and dark options:

```html
<ThemePicker label="Choose theme">
  <ThemePickerButton pressed={theme === 'light'} label="Light theme" onclick={() => setTheme('light')}>
    Light
  </ThemePickerButton>
  <ThemePickerButton pressed={theme === 'dark'} label="Dark theme" onclick={() => setTheme('dark')}>
    Dark
  </ThemePickerButton>
</ThemePicker>
```

With high-contrast option and visual swatches:

```html
<ThemePicker label="Appearance">
  <ThemePickerButton pressed={theme === 'light'} label="Light theme" onclick={() => setTheme('light')}>
    <span class="swatch swatch-light"></span> Light
  </ThemePickerButton>
  <ThemePickerButton pressed={theme === 'dark'} label="Dark theme" onclick={() => setTheme('dark')}>
    <span class="swatch swatch-dark"></span> Dark
  </ThemePickerButton>
  <ThemePickerButton pressed={theme === 'high-contrast'} label="High contrast theme" onclick={() => setTheme('high-contrast')}>
    <span class="swatch swatch-high-contrast"></span> High Contrast
  </ThemePickerButton>
</ThemePicker>
```

## Keyboard Interactions

- Tab: Focus the button
- Enter: Select the theme
- Space: Select the theme
- (All handled natively by `<button>` element)

## ARIA

- Implicit `button` role from `<button>` element
- `aria-pressed` -- indicates whether this theme is currently selected
- `aria-label` -- describes the theme this button represents

## When to Use

- Use inside a ThemePicker to represent one selectable theme option.
- Use when you want button-based theme selection with visual previews or swatches.
- Use when each theme option needs custom content such as icons or colour samples.

## When Not to Use

- Do not use outside of a ThemePicker -- the button relies on the picker for grouping and context.
- Do not use for non-theme selections -- use [SegmentGroupItem](../segment-group-item/) instead.
- Do not use for standalone toggle actions -- use [ToggleButton](../toggle-button/) instead.

## Headless

This component provides a `<button>` element with `aria-pressed` for toggle state and `aria-label` for theme identification, with zero visual styling. The consumer is responsible for all CSS including theme preview swatch, selected state indicator, hover effects, and focus styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.theme-picker-button` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<button>` element with class `theme-picker-button`
- Verify `aria-pressed` reflects the selected state
- Verify `aria-label` is applied
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Show a visual preview of each theme (color swatches, mini layout). Clearly indicate the selected theme with a visual marker.
- **Developers**: Manage the pressed state from the parent ThemePicker component. Use `aria-pressed` to communicate selection state.

## Composition

ThemePickerButton is used within a ThemePicker component following the Picker/PickerButton pattern.
