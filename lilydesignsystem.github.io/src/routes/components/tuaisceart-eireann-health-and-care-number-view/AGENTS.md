# TuaisceartEireannHealthAndCareNumberView

## Metadata

- Component: tuaisceart-eireann-health-and-care-number-view
- PascalCase: TuaisceartEireannHealthAndCareNumberView
- Description: a read-only display of Tuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier
- HTML tag: <span>
- CSS class: .tuaisceart-eireann-health-and-care-number-view
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the H&C Number value as inline text content
- Read-only display; pairs with TuaisceartEireannHealthAndCareNumberInput for editing

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop

## Keyboard

- None -- passive display-only component

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: `""`) -- the H&C Number string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Acceptance Criteria

- [ ] Renders <span> with class="tuaisceart-eireann-health-and-care-number-view"
- [ ] Has aria-label
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Companion: TuaisceartEireannHealthAndCareNumberInput
