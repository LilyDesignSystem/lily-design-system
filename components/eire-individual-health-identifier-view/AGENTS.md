# EireIndividualHealthIdentifierView

## Metadata

- Component: eire-individual-health-identifier-view
- PascalCase: EireIndividualHealthIdentifierView
- Description: a read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .eire-individual-health-identifier-view
- Interactive: no

## Key Behaviors

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the IHI value as inline text content
- Read-only display component; pairs with EireIndividualHealthIdentifierInput for editing
- No formatting or validation logic; the consumer provides the value pre-formatted

## ARIA

## Keyboard

- None -- passive display-only component

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: `""`) -- the IHI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Acceptance Criteria

- [ ] Renders <span> element with class="eire-individual-health-identifier-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: EireIndividualHealthIdentifierInput
