# TagGroup

## Metadata

- Component: tag-group
- PascalCase: TagGroup
- Description: a group of tag elements
- HTML tag: <div>
- CSS class: .tag-group
- Interactive: no

## Composition

- Pattern: Group
- Children: tag

## Key Behaviors

- Renders a `<div>` with `role="group"` to semantically group child tag elements
- Uses `aria-label` for an accessible name describing the group
- Accepts a `children` slot for rendering tag elements inside the group
- Spreads `restProps` onto the container for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

- `role="group"` -- identifies the container as a semantic grouping of related elements
- `aria-label={label}` -- provides an accessible name describing the purpose of the tag collection

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the group via `aria-label`
- `children`: slot (required) -- tag elements to render inside the group
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="tag-group"
- [ ] Has aria-label attribute
- [ ] Has role="group"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tag-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tag-group.html
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
