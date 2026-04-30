# InformationCallout

## Metadata

- Component: information-callout
- PascalCase: InformationCallout
- Description: a callout box highlighting informational content
- HTML tag: <div>
- CSS class: .information-callout
- Interactive: no

## Key Behaviors

- Renders an `<aside>` element with `role="note"` for semantic supplementary content
- Uses `aria-label` to provide an accessible name describing the nature of the callout
- Accepts a `children` slot for flexible callout content
- Spreads `restProps` onto the aside for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

- `role="note"` -- identifies the content as a note or supplementary information
- `aria-label={label}` -- provides an accessible name describing the type of callout (e.g., "Note", "Warning", "Tip")

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the callout via `aria-label`
- `children`: slot (required) -- callout content to display
- `...restProps`: unknown -- additional attributes spread onto the `<aside>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="information-callout"
- [ ] Has aria-label attribute
- [ ] Has role="note"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .information-callout in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/information-callout.html
- WAI-ARIA note role: https://www.w3.org/TR/wai-aria-1.2/#note
- HTML aside element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
