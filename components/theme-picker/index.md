# Theme Picker

ThemePicker is a headless theme selection component that renders a `<fieldset>` with the `radiogroup` role. It provides an accessible container for radio button options that let users choose between themes such as light, dark, or system preference.

This component is useful for settings pages, preference panels, or any interface where users need to select from a set of theme options. Consumers provide the radio button markup as children, allowing full control over the option labels and values.

## Implementation Notes

- Renders a `<fieldset>` element with `role="radiogroup"` for semantic grouping of radio options
- Uses `aria-label` for an accessible name describing the radio group
- Accepts a `children` slot for rendering radio button options inside the fieldset
- Spreads `restProps` onto the fieldset for consumer customization
- pattern: standard props destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the radio group via `aria-label`
- `children`: slot (required) -- radio button option elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Usage

Basic light/dark theme selection using radio buttons:

```html
<ThemePicker label="Theme">
  <label><input type="radio" name="theme" value="light" checked /> Light</label>
  <label><input type="radio" name="theme" value="dark" /> Dark</label>
</ThemePicker>
```

Settings page with multiple themes using ThemePickerButton:

```html
<ThemePicker label="Choose theme">
  <ThemePickerButton pressed={theme === 'light'} label="Light theme" onclick={() => setTheme('light')}>
    Light
  </ThemePickerButton>
  <ThemePickerButton pressed={theme === 'dark'} label="Dark theme" onclick={() => setTheme('dark')}>
    Dark
  </ThemePickerButton>
  <ThemePickerButton pressed={theme === 'high-contrast'} label="High contrast theme" onclick={() => setTheme('high-contrast')}>
    High Contrast
  </ThemePickerButton>
</ThemePicker>
```

With system preference option:

```html
<ThemePicker label="Appearance">
  <label><input type="radio" name="appearance" value="system" checked /> System</label>
  <label><input type="radio" name="appearance" value="light" /> Light</label>
  <label><input type="radio" name="appearance" value="dark" /> Dark</label>
</ThemePicker>
```

## Keyboard Interactions

None at the container level. Keyboard behavior is handled natively by the `<input type="radio">` elements provided by the consumer (Arrow keys to navigate between options, Space to select).

## ARIA

- `role="radiogroup"` -- identifies the fieldset as a group of related radio buttons
- `aria-label={label}` -- provides an accessible name describing the purpose of the theme selection

## When to Use

- Use for selecting a visual theme such as light, dark, or high-contrast mode.
- Use in settings pages or preference panels where all theme options should be visible at once.
- Use when a radiogroup-based selection provides better discoverability than a dropdown.
- Use when you want to show visual previews or swatches alongside each theme option.
- Use when there are two to five theme options that fit comfortably in the layout.

## When Not to Use

- Do not use for display-only theme information -- use [ThemeView](../theme-view/) instead.
- Do not use when a compact dropdown is preferred -- use [ThemeSelect](../theme-select/) instead.
- Do not use for a simple binary light/dark toggle -- use [SwitchButton](../switch-button/) or [ToggleButton](../toggle-button/) instead.
- Do not use for non-theme selections -- use [RadioGroup](../radio-group/) or [SegmentGroup](../segment-group/) instead.

## Headless

This headless component provides a semantic `<fieldset>` with `role="radiogroup"` and an `aria-label` for accessible theme selection. The consumer provides all radio button markup, visual styling, layout, and theme application logic.


## Styles

The consumer provides all CSS styling. The component renders with a `.theme-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `theme-picker`
- Verify role="radiogroup"` -- identifies the fieldset as a group of related radio buttons
- Verify aria-label={label}` -- provides an accessible name describing the purpose of the theme selection
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place theme options in a clear, evenly spaced row or column with recognizable labels or icons for each theme.
- **Developers**: Persist the selected theme to localStorage or a user preferences API so it survives page reloads.

## Composition

ThemePicker is a standalone picker component that contains consumer-provided radio buttons. It is related to ThemeSelect (dropdown approach) and ThemeView (read-only display). Use ThemePicker when you want visible radio options; use ThemeSelect for a compact dropdown.

## References

- WAI-ARIA radiogroup role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
