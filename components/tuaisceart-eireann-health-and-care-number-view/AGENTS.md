# TuaisceartEireannHealthAndCareNumberView

## Metadata

- Component: tuaisceart-eireann-health-and-care-number-view
- PascalCase: TuaisceartEireannHealthAndCareNumberView
- Description: a read-only display of Tuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .tuaisceart-eireann-health-and-care-number-view
- Interactive: no

## Key Behaviors

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the H&C Number value as inline text content
- Read-only display; pairs with TuaisceartEireannHealthAndCareNumberInput for editing

## ARIA

## Keyboard

- None -- passive display-only component

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: `""`) -- the H&C Number string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Acceptance Criteria

- [ ] Renders <span> with class="tuaisceart-eireann-health-and-care-number-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Companion: TuaisceartEireannHealthAndCareNumberInput
