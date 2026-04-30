# UnitedStatesSocialSecurityNumberView

## Metadata

- Component: united-states-social-security-number-view
- PascalCase: UnitedStatesSocialSecurityNumberView
- Description: a read-only display of a US Social Security number
- HTML tag: <div>
- CSS class: .united-states-social-security-number-view
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the SSN value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses props for prop destructuring with rest props spread
- No formatting, masking, or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the SSN string to display (e.g., "123-45-6789")
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="united-states-social-security-number-view"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-states-social-security-number-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/united-states-social-security-number-view.html
- Social Security Number: https://www.ssa.gov/history/ssn/geocard.html
