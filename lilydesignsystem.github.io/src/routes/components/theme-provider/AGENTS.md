# ThemeProvider

## Metadata

- Component: theme-provider
- PascalCase: ThemeProvider
- Description: a container that applies CSS custom properties from a theme object to its children
- HTML tag: <div>
- CSS class: .theme-provider
- Interactive: no

## Key Behaviors

- Flattens a nested theme object into `--theme-*` CSS custom properties
- Merges custom theme with a base light or dark theme
- Uses `display: contents` to avoid affecting layout
- Nested ThemeProvider components can override parent theme values

## ARIA

- None -- presentational wrapper. Ensure sufficient color contrast in custom themes.

## Keyboard

- None

## Props

- `theme`: object (required) -- theme object with key-value pairs flattened to CSS custom properties
- `base`: "light" | "dark" (default: "light") -- base theme to merge with
- `children`: slot (required) -- themed content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="theme-provider"
- [ ] Flattens nested theme object into --theme-* CSS custom properties
- [ ] Merges custom theme with base light or dark theme
- [ ] Uses display: contents to avoid affecting layout
- [ ] Nested ThemeProvider components override parent theme values
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .theme-provider in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-provider.html
- Reuters Graphics Theme component
- CSS custom properties
