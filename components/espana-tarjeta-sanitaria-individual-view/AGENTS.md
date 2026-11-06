# EspanaTarjetaSanitariaIndividualView

## Metadata

- Component: espana-tarjeta-sanitaria-individual-view
- PascalCase: EspanaTarjetaSanitariaIndividualView
- Description: a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .espana-tarjeta-sanitaria-individual-view
- Interactive: no

## Key Behaviors

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the TSI/CIP-SNS value as inline text content
- Read-only display component; pairs with EspanaTarjetaSanitariaIndividualInput for editing
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## ARIA

## Keyboard

- None -- this is a passive display-only component

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: `""`) -- the TSI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="espana-tarjeta-sanitaria-individual-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- Companion: EspanaTarjetaSanitariaIndividualInput
