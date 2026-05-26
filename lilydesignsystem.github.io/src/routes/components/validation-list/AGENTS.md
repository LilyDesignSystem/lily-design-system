# ValidationList

## Metadata

- Component: validation-list
- PascalCase: ValidationList
- Description: a live-feedback list of input validation rules with pending, passed, and failed states
- HTML tag: <ul>
- CSS class: .validation-list
- Interactive: no

## Key Behaviors

- Renders a `<ul>` with class `validation-list`
- `label` prop is REQUIRED and sets `aria-label`
- `aria-live="polite"` is set so status changes are announced
- Children are expected to be `validation-list-item` elements with status props
- Pass-through attributes are forwarded to the root `<ul>`

## ARIA

- Implicit `list` role from the `<ul>` element
- `aria-label` describes the field the rules apply to
- `aria-live="polite"` announces status changes

## Keyboard

- Tab: moves focus past the list (the list is not interactive)
- The list itself does not handle keyboard input

## Props

- `label`: string (REQUIRED) -- aria-label describing the field
- `children`: slot -- `validation-list-item` children
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <ul> element with class="validation-list"
- [ ] aria-label equals the label prop
- [ ] aria-live="polite" is set on the list
- [ ] Children render inside the list
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .validation-list in css-style-sheet-template.css
- US Web Design System Validation: https://designsystem.digital.gov/components/validation/
- WAI-ARIA aria-live: https://www.w3.org/TR/wai-aria-1.2/#aria-live
