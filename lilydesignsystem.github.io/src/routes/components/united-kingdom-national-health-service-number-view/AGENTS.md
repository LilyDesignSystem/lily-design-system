# UnitedKingdomNationalHealthServiceNumberView

## Metadata

- Component: united-kingdom-national-health-service-number-view
- PascalCase: UnitedKingdomNationalHealthServiceNumberView
- Description: a read-only display of a UK NHS number
- HTML tag: <div>
- CSS class: .united-kingdom-national-health-service-number-view
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the NHS number value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses props for prop destructuring with rest props spread
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the NHS number string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="united-kingdom-national-health-service-number-view"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-kingdom-national-health-service-number-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/united-kingdom-national-health-service-number-view.html
- NHS Number: https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/
