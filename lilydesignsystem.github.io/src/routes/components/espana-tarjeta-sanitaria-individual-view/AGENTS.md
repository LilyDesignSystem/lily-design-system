# EspanaTarjetaSanitariaIndividualView

## Metadata

- Component: espana-tarjeta-sanitaria-individual-view
- PascalCase: EspanaTarjetaSanitariaIndividualView
- Description: a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- HTML tag: <span>
- CSS class: .espana-tarjeta-sanitaria-individual-view
- Interactive: no

## Key Behaviors

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the TSI/CIP-SNS value as inline text content
- Read-only display component; pairs with EspanaTarjetaSanitariaIndividualInput for editing
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the TSI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="espana-tarjeta-sanitaria-individual-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: EspanaTarjetaSanitariaIndividualInput
