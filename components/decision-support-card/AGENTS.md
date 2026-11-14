# DecisionSupportCard

## Metadata

- Component: decision-support-card
- PascalCase: DecisionSupportCard
- Description: a clinical decision support card with a summary, urgency indicator, source, suggestions and override reasons
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <div>
- CSS class: .decision-support-card
- Interactive: yes

## Key Behaviors

- Renders `<div class="decision-support-card" role="group">` named by its summary, with `data-indicator` (`info`, `warning`, `critical`)
- The indicator is also text (`indicatorLabel`), so urgency is never colour alone
- Suggestions are real buttons; the consumer applies them and enforces CDS Hooks' `selectionBehavior`
- Dismissing is a form: when `overrideReasons` are given the reason select is required, and a dismissal without one is refused (the select is marked `aria-invalid` and focused). The static catalogs (HTML, Nunjucks, Alpine) rely on the browser's own validation
- Not a live region: whether a critical card interrupts is the consumer's choice

## ARIA

- `role="group"` with `aria-label` from the summary (or `label`). Not a landmark and not a live region. `aria-invalid` on the reason select when a dismissal is refused

## Keyboard

- Tab moves through the source link, suggestions, links, the reason select and the dismiss button; Enter or Space activates a suggestion or the dismiss button

## Props

- `summary`: string (required) — the one-sentence summary (CDS Hooks: under 140 characters); names the card
- `indicator`: "info" | "warning" | "critical" (required) — rendered as `data-indicator`
- `indicatorLabel`: string (required) — the indicator in words
- `sourceLabel`: string (required) — where the guidance comes from
- `sourceHref`: string (optional) — a link to the source
- `suggestions`: { id, label, isRecommended? }[] (optional) — each a button
- `links`: { label, href }[] (optional) — links to more information
- `dismissLabel`: string (optional) — the dismiss button's text; no button without it
- `overrideReasons`: { code, display }[] (optional) — when given, dismissing asks for one
- `overrideReasonLabel`: string (optional) — the reason select's label
- `overrideReasonPlaceholder`: string (optional) — the text of the select's empty first option
- `label`: string (optional) — the accessible name, when it should differ from the summary
- `children`: slot (optional) — the detail
- `onSuggestion`: callback (optional) — called with the chosen suggestion's id
- `onDismiss`: callback (optional) — called with the chosen reason's code, or none when no reasons are offered
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <div> with class="decision-support-card"
- [x] The card is a group named by its summary and is not a live region
- [x] Enter and Space choose a suggestion
- [x] Dismissing without a reason is refused when reasons are offered, and focus moves to the select
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .decision-support-card in css-style-sheet-template.css
- CDS Hooks 2.0, Card: https://cds-hooks.hl7.org/2.0/
- AHRQ PSNet primer, alert fatigue: https://psnet.ahrq.gov/primer/alert-fatigue
- Spec: spec/healthcare-ui/index.md
