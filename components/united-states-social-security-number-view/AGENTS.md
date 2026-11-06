# UnitedStatesSocialSecurityNumberView

## Metadata

- Component: united-states-social-security-number-view
- PascalCase: UnitedStatesSocialSecurityNumberView
- Description: a read-only display of a US Social Security number
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .united-states-social-security-number-view
- Interactive: no

## Key Behaviors

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the SSN value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses props for prop destructuring with rest props spread
- No formatting, masking, or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- Screen readers announce the label followed by the text content (the number value)

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: `""`) -- the SSN string to display (e.g., "123-45-6789")
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="united-states-social-security-number-view"
- [ ] Has no `aria-label` on the root
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-states-social-security-number-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/united-states-social-security-number-view.html
- Social Security Number: https://www.ssa.gov/history/ssn/geocard.html
