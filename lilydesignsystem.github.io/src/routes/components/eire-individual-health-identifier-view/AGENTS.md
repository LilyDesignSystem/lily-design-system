# EireIndividualHealthIdentifierView

## Metadata

- Component: eire-individual-health-identifier-view
- PascalCase: EireIndividualHealthIdentifierView
- Description: a read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier
- HTML tag: <span>
- CSS class: .eire-individual-health-identifier-view
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the IHI value as inline text content
- Read-only display component; pairs with EireIndividualHealthIdentifierInput for editing
- No formatting or validation logic; the consumer provides the value pre-formatted

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop

## Keyboard

- None -- passive display-only component

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: `""`) -- the IHI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Acceptance Criteria

- [ ] Renders <span> element with class="eire-individual-health-identifier-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: EireIndividualHealthIdentifierInput
