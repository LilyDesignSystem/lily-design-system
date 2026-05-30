# AddressographBox

## Metadata

- Component: addressograph-box
- PascalCase: AddressographBox
- Description: a box that shows a person's identification details, such as name, tracking information, and salient notations
- HTML tag: <div>
- CSS class: .addressograph-box
- Interactive: no

## Key Behaviors

- Uses `<div>` element with class `addressograph-box`
- Optional `aria-label` describes the box for screen readers
- Contains slots for name, date of birth, identifier, ward/location, and salient notations

## ARIA

- `aria-label` -- describes the box for screen readers

## Keyboard

- None -- the addressograph-box is informational, not interactive

## Props

- `label`: string (optional) -- accessible label for the addressograph-box box
- `children`: slot (required) -- identifying content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="addressograph-box"
- [ ] Has aria-label attribute when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .addressograph-box in css-style-sheet-template.css
