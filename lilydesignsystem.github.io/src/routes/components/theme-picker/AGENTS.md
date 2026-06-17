# ThemeSelect

## Metadata

- Component: theme-select
- PascalCase: ThemeSelect
- Description: a picker for selecting a visual theme
- HTML tag: <div>
- CSS class: .theme-select
- Interactive: no

## Key Behaviors

- Renders a `<fieldset>` element with `role="radiogroup"` for semantic grouping of radio options
- Uses `aria-label` for an accessible name describing the radio group
- Accepts a `children` slot for rendering radio button options inside the fieldset
- Spreads `restProps` onto the fieldset for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

- `role="radiogroup"` -- identifies the fieldset as a group of related radio buttons
- `aria-label={label}` -- provides an accessible name describing the purpose of the theme selection

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the radio group via `aria-label`
- `children`: slot (required) -- radio button option elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="theme-select"
- [ ] Has aria-label attribute
- [ ] Has role="radiogroup"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .theme-select in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-select.html
- WAI-ARIA radiogroup role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
