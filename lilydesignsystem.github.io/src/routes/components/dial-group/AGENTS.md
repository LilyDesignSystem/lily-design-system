# DialGroup

## Metadata

- Component: dial-group
- PascalCase: DialGroup
- Description: a group of dial components
- HTML tag: <div>
- CSS class: .dial-group
- Interactive: no

## Key Behaviors

- Uses `<div>` element with `role="group"` to semantically group dials
- `aria-label` describes the group purpose
- Renders child dial components in source order

## ARIA

- `role="group"` -- semantically groups the contained dials
- `aria-label` -- describes the purpose of the group

## Keyboard

- None at the group level -- individual dials handle their own keyboard interactions

## Props

- `label`: string (required) -- accessible label for the dial group
- `children`: slot -- dial components
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="dial-group"
- [ ] Has role="group"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .dial-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/dial-group.html
