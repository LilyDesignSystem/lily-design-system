# Decision Support Card

DecisionSupportCard is a headless clinical decision support card in the shape of a CDS Hooks card: a one-line summary, an urgency indicator, the source of the guidance, optional detail, suggestions, links, and a way to dismiss it with a reason. CDS Hooks leaves rendering to the host system; this is that rendering, with no styling.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<div class="decision-support-card" role="group">` named by its summary, with `data-indicator` (`info`, `warning`, `critical`)
- The indicator is also text (`indicatorLabel`), so urgency is never colour alone
- Suggestions are real buttons; the consumer applies them and enforces CDS Hooks' `selectionBehavior`
- Dismissing is a form: when `overrideReasons` are given the reason select is required, and a dismissal without one is refused (the select is marked `aria-invalid` and focused). The static catalogs (HTML, Nunjucks, Alpine) rely on the browser's own validation
- Not a live region: whether a critical card interrupts is the consumer's choice

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

## Usage

```html
<DecisionSupportCard
  summary="Penicillin allergy recorded"
  indicator="critical"
  indicatorLabel="Critical"
  sourceLabel="Local formulary"
  suggestions={[{ id: "cancel", label: "Cancel amoxicillin", isRecommended: true }]}
  dismissLabel="Dismiss"
  overrideReasons={[{ code: "aware", display: "Patient tolerated before" }]}
  overrideReasonLabel="Reason for dismissing"
  overrideReasonPlaceholder="Choose a reason"
>
  <p>Amoxicillin is a penicillin.</p>
</DecisionSupportCard>
```

## Keyboard Interactions

| Key           | Action                                       |
| ------------- | -------------------------------------------- |
| Tab           | Moves to the next control in the card        |
| Enter / Space | Activates a suggestion or the dismiss button |

## ARIA

- `role="group"` with `aria-label` from the summary (or `label`). Not a landmark and not a live region. `aria-invalid` on the reason select when a dismissal is refused

## When to Use

- Use to show a CDS Hooks card or any rule-based advice beside the task it concerns.
- Use when advice can be accepted with one action or dismissed with a reason.
- Use for information and warnings inline, and inside an `alert-dialog` only for critical items.

## When Not to Use

- Do not use for a page-wide message — use `banner` or `alert`.
- Do not use for patient-facing care advice — use `care-card`.
- Do not make every card interrupt; that is how alert fatigue starts.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.decision-support-card` class hook, and every word.

## Styles

`.decision-support-card` and its parts, and `[data-indicator]`.

## Testing

- The card is a group named by its summary and is not a live region
- Enter and Space choose a suggestion
- Dismissing without a reason is refused when reasons are offered, and focus moves to the select

## Advice

- Tier interruption by severity: information inline, a warning visible without blocking, only critical interrupting (AHRQ).
- Remove a card when the hook it answered is triggered again; the consumer owns that.
- Record the outcome (accepted, overridden with a reason) through CDS Hooks feedback; the consumer owns that too.

## Related components

- `alert-dialog` — a modal dialog for urgent messages requiring acknowledgment
- `care-card` — a medical care instruction card with urgency levels
- `medication-view` — a medicine with its strength, form, route and frequency

## References

- CDS Hooks 2.0, Card: https://cds-hooks.hl7.org/2.0/
- AHRQ PSNet primer, alert fatigue: https://psnet.ahrq.gov/primer/alert-fatigue
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md

---

Lily™ and Lily Design System™ are trademarks.
