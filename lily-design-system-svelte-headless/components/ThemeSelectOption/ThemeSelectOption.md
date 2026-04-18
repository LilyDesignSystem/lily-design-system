# ThemeSelectOption

A theme select option is a single `<option>` element for use inside a ThemeSelect dropdown. It represents one available theme choice such as light, dark, high-contrast, or system default. The component wraps the native HTML `<option>` element with Svelte 5 runes and accepts a value prop for the theme identifier and children for the visible label text.

Supports `selected` for pre-selecting a theme and `disabled` for preventing selection, both using native HTML attributes. All accessibility behavior is provided automatically by the browser's native `<option>` element within the parent `<select>`.

## Implementation Notes

- Wraps native `<option>` element with Svelte 5 runes
- Uses `children` Snippet for label text content
- Supports `selected` and `disabled` HTML attributes
- Spreads `...restProps` on the root `<option>` element
- Must be used inside a ThemeSelect component for proper semantics
- All text content comes through children and props for internationalization

## Props

- `value`: string (required) -- the theme identifier submitted when selected
- `selected`: boolean (default: false) -- whether this theme option is pre-selected
- `disabled`: boolean (default: false) -- whether this theme option is disabled
- `children`: Snippet (required) -- option label text
- `...restProps`: Any additional HTML attributes passed to the `<option>` element

## Usage

```svelte
<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
  <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
  <ThemeSelectOption value="system">System Default</ThemeSelectOption>
</ThemeSelect>
```

## Keyboard Interactions

- Native `<option>` keyboard behavior (managed by parent ThemeSelect / `<select>`)

## ARIA

- Native `<option>` provides built-in accessibility via the parent `<select>` element
- Screen readers announce the option text and selected state automatically

## References

- HTML option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
