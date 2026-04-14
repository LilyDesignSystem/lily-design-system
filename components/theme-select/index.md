# Theme Select

A theme select is a headless component that allows users to switch between different visual themes or color schemes using a native `<select>` dropdown. It is commonly used to offer light, dark, high-contrast, or other visual modes, enhancing personalization and accessibility by letting users adapt the interface to their preferences or environment.

The consumer provides `<option>` elements as children to define the available themes. The component uses `aria-label` for accessible naming and supports two-way binding on the selected theme.

## Help

Use ThemeSelect when you need a dropdown for switching visual themes. Common scenarios include light/dark mode toggles, high-contrast themes for accessibility, or branded theme options. Pair with ThemeSelectOption for individual options, or use plain `<option>` elements.

## Syntax

```html
<ThemeSelect label="..." value={value}>
  <option value="...">...</option>
</ThemeSelect>
```

## Usage

Basic light/dark theme dropdown:

```html
<ThemeSelect label="Theme" value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
</ThemeSelect>
```

Extended theme options with system default:

```html
<ThemeSelect label="Color scheme" value={theme}>
  <ThemeSelectOption value="system">System Default</ThemeSelectOption>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
  <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
</ThemeSelect>
```

In a settings form:

```html
<Form label="Preferences" onSubmit={handleSubmit}>
  <Field label="Theme">
    <ThemeSelect label="Theme" value={theme}>
      <ThemeSelectOption value="" disabled>Choose a theme...</ThemeSelectOption>
      <ThemeSelectOption value="light">Light</ThemeSelectOption>
      <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
      <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
    </ThemeSelect>
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

## Props

| Prop           | Type            | Default    | Description                                               |
| -------------- | --------------- | ---------- | --------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name applied via `aria-label`                  |
| `value`        | `string`        | `""`       | Bindable string representing the currently selected theme |
| `children`     | `slot`       | (required) | `<option>` elements representing available themes         |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<select>` element  |

## Examples

With theme application:

```html
<ThemeSelect label="Choose theme" value={theme}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</ThemeSelect>
```

## Keyboard Interactions

- Tab: Moves focus to and from the select element (native browser behavior)
- Space/Enter: Opens the dropdown list when focused (native browser behavior)
- Arrow Up/Down: Navigates through theme options (native browser behavior)
- Escape: Closes the dropdown list (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the theme select since there is no visible `<label>` element
## When to Use

- Use for selecting a visual theme from a dropdown when space is limited.
- Use as a compact alternative to ThemePicker when there are many theme options.
- Use in navigation bars, toolbars, or sidebars where a dropdown fits the layout better than radio buttons.
- Use when theme options do not need visual previews or swatches.

## When Not to Use

- Do not use when visual preview of themes is important -- use [ThemePicker](../theme-picker/) with swatches instead.
- Do not use for non-theme selections -- use [Select](../select/) with custom options instead.
- Do not use for a simple binary light/dark toggle -- use [SwitchButton](../switch-button/) or [ToggleButton](../toggle-button/) instead.

## Headless

This headless component provides a native `<select>` element with an `aria-label` for accessible theme switching. Keyboard navigation and dropdown behavior come from the browser's native select. The consumer provides `<option>` children (or ThemeSelectOption components) and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.theme-select` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<select>` element with class `theme-select`
- Verify aria-label={label}` -- provides an accessible name for the theme select since there is no visible `<label>` element
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the selected option clearly indicates the active theme. Consider showing a preview swatch next to each option label.
- **Developers**: Apply the selected theme value to the document root (e.g., `data-theme` attribute or CSS class) and persist the choice across sessions.

## Composition

ThemeSelect contains ThemeSelectOption children (or plain `<option>` elements) following the Select/SelectOption pattern. ThemeSelect is also related to ThemePicker (radio-based approach) and ThemeView (read-only display).

## References

- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
- WCAG 1.4.12 Text Spacing (theme customization): https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
