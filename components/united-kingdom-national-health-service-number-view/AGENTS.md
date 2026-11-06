# UnitedKingdomNationalHealthServiceNumberView

## Metadata

- Component: united-kingdom-national-health-service-number-view
- PascalCase: UnitedKingdomNationalHealthServiceNumberView
- Description: a read-only display of a UK NHS number
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .united-kingdom-national-health-service-number-view
- Interactive: no

## Key Behaviors

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the NHS number value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses props for prop destructuring with rest props spread
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- Screen readers announce the label followed by the text content (the number value)

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: `""`) -- the NHS number string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="united-kingdom-national-health-service-number-view"
- [ ] Has no `aria-label` on the root
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .united-kingdom-national-health-service-number-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/united-kingdom-national-health-service-number-view.html
- NHS Number: https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/
