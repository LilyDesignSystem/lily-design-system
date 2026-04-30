# ThemeView

## Metadata

- Component: theme-view
- PascalCase: ThemeView
- Description: a read-only display of the current theme
- HTML tag: <div>
- CSS class: .theme-view
- Interactive: no

## Key Behaviors

- Renders a `<span>` element containing the theme value as text content
- Uses `aria-label` to provide an accessible name for the displayed value
- Both `label` and `value` are required props
- Spreads `restProps` onto the span for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

- `aria-label={label}` -- provides an accessible name describing what the displayed value represents

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the display element via `aria-label`
- `value`: string (required) -- the current theme name to display as text content
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="theme-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .theme-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-view.html
- WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/
