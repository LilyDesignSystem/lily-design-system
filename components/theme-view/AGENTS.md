# ThemeView

## Metadata

- Component: theme-view
- PascalCase: ThemeView
- Description: a read-only display of the current theme
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <span>
- CSS class: .theme-view
- Interactive: no

## Key Behaviors

- Renders a `<span>` element containing the theme value as text content
- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Both `label` and `value` are required props
- Spreads `restProps` onto the span for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (required) -- the current theme name to display as text content
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="theme-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .theme-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-view.html
- WAI-ARIA Accessible Name: https://www.w3.org/TR/accname-1.2/
