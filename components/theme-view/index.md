# Theme View

ThemeView is a headless component that displays the current theme name as inline text. It renders the theme value in a `<span>` element with an accessible label, making the current theme selection readable by screen readers.

This component is commonly paired with ThemePicker in an Input/View pattern. While ThemePicker allows the user to select a theme, ThemeView displays the currently active theme. It is useful in settings panels, status bars, or anywhere the current theme needs to be communicated visually and programmatically.

## Implementation Notes

- Renders a `<span>` element containing the theme value as text content
- Uses `aria-label` to provide an accessible name for the displayed value
- Both `label` and `value` are required props
- Spreads `restProps` onto the span for consumer customization
- pattern: standard props destructuring with typed props

## Props

- `label`: string (required) -- accessible name for the display element via `aria-label`
- `value`: string (required) -- the current theme name to display as text content
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Usage

Display the current theme in a settings summary:

```html
<ThemeView label="Current theme" value="dark" />
```

In a summary list alongside other preferences:

```html
<SummaryList>
  <SummaryListItem>
    <dt>Theme</dt>
    <dd><ThemeView label="Current theme" value={currentTheme} /></dd>
  </SummaryListItem>
  <SummaryListItem>
    <dt>Language</dt>
    <dd>English</dd>
  </SummaryListItem>
</SummaryList>
```

In a status bar showing the active theme:

```html
<footer>
  <ThemeView label="Active theme" value={theme} data-theme={theme} />
</footer>
```

## Keyboard Interactions

None -- this component is a passive display element with no interactive behavior.

## ARIA

- `aria-label={label}` -- provides an accessible name describing what the displayed value represents

## When to Use

- Use to display the current theme in read-only format in settings summaries and status bars.
- Use in confirmation screens where the user has just selected a theme and needs to see it confirmed.
- Use when displaying the active theme alongside other user preferences.
- Use in admin panels to show the theme assigned to a user or organisation.

## When Not to Use

- Do not use when users need to select or change the theme -- use [ThemePicker](../theme-picker/) or [ThemeSelect](../theme-select/) instead.
- Do not use for general-purpose text display -- use a `<span>` or [Badge](../badge/) instead.

## Headless

This headless component provides a `<span>` element with `aria-label` for accessible read-only theme display. The consumer provides all visual styling, including typography, color, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.theme-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `theme-view`
- Verify aria-label={label}` -- provides an accessible name describing what the displayed value represents
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style the theme name to visually reflect the current theme (e.g., dark text for dark mode label) so users can confirm at a glance.
- **Developers**: Keep the `value` prop in sync with the actual applied theme so the display is always accurate.

## Composition

ThemeView is the read-only display counterpart to ThemePicker and ThemeSelect. Use ThemeView to show the current theme, and pair it with ThemePicker or ThemeSelect for editing.

## References

- WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/
