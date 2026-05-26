# ButtonGroup

## Metadata

- Component: button-group
- PascalCase: ButtonGroup
- Description: a wrapper that groups related buttons together
- HTML tag: <div>
- CSS class: .button-group
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="group"` and the supplied `aria-label`
- Acts as a passive container — no internal state or behavior
- Children are the related buttons; the component does not enforce count or order
- Pass-through attributes are forwarded to the root `<div>`

## ARIA

- `role="group"` on the root `<div>`
- `aria-label` is required and provides the accessible name of the group

## Keyboard

- Tab: moves focus across child buttons
- All other key handling is delegated to the buttons inside the group

## Props

- `label`: string (REQUIRED) -- aria-label for the group
- `children`: slot -- the related buttons
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="button-group"
- [ ] role="group" is set on the root element
- [ ] aria-label is present and equals the label prop
- [ ] Children render inside the group
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .button-group in css-style-sheet-template.css
- US Web Design System Button Group: https://designsystem.digital.gov/components/button-group/
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
