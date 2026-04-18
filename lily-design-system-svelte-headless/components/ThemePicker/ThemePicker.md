# ThemePicker

ThemePicker is a headless theme selection component that renders a `<fieldset>` with the `radiogroup` role. It provides an accessible container for radio button options that let users choose between themes such as light, dark, or system preference.

This component is useful for settings pages, preference panels, or any interface where users need to select from a set of theme options. Consumers provide the radio button markup as children, allowing full control over the option labels and values.

## Implementation Notes

- Renders a `<fieldset>` element with `role="radiogroup"` for semantic grouping of radio options
- Uses `aria-label` for an accessible name describing the radio group
- Accepts a `children` Snippet for rendering radio button options inside the fieldset
- Spreads `restProps` onto the fieldset for consumer customization
- Svelte 5 pattern: standard `$props()` destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the radio group via `aria-label`
- `children`: Snippet (required) -- radio button option elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Usage

```svelte
<ThemePicker label="Theme">
  <label><input type="radio" name="theme" value="light" /> Light</label>
  <label><input type="radio" name="theme" value="dark" /> Dark</label>
</ThemePicker>
```

## Keyboard Interactions

None at the container level. Keyboard behavior is handled natively by the `<input type="radio">` elements provided by the consumer (Arrow keys to navigate between options, Space to select).

## ARIA

- `role="radiogroup"` -- identifies the fieldset as a group of related radio buttons
- `aria-label={label}` -- provides an accessible name describing the purpose of the theme selection

## References

- WAI-ARIA radiogroup role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
