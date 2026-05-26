# ToggleGroup

## Metadata

- Component: toggle-group
- PascalCase: ToggleGroup
- Description: a group of toggle buttons for selecting options
- HTML tag: <div>
- CSS class: .toggle-group
- Interactive: no

## Composition

- Pattern: Group
- Children: toggle-button

## Key Behaviors

- Renders a `<div>` with `role="group"` to semantically group child toggle buttons
- Uses `aria-label` for an accessible name describing the group
- Accepts a `children` slot for rendering toggle button elements inside the group
- Spreads `restProps` onto the container for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

- `role="group"` -- identifies the container as a semantic grouping of related toggle buttons
- `aria-label={label}` -- provides an accessible name describing the purpose of the toggle collection

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the group via `aria-label`
- `children`: slot (required) -- toggle button elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="toggle-group"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .toggle-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/toggle-group.html
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Button Pattern (toggle): https://www.w3.org/WAI/ARIA/apg/patterns/button/
