# Observation View

ObservationView is a headless read-only display of one clinical observation or test result: its value, unit, interpretation flag and reference range. It renders as a `<span>`. It shows what the consumer's code decided, and computes no flag and no range.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<span class="observation-view">` with parts `observation-view-value`, `-unit`, `-flag`, `-range` and `-status`
- `interpretation` is a FHIR v3 ObservationInterpretation code (`N`, `L`, `H`, `LL`, `HH`, `A`, …), rendered as `data-interpretation` and never as text
- `flagLabel` is the flag in the consumer's words; it is required whenever the flag is not normal, so the meaning is never colour alone (a development warning says so)
- `status` is `final`, `preliminary`, `not-recorded` or `unavailable`, rendered as `data-status`; a not-recorded or unavailable result shows `statusLabel` instead of the value, so it is never blank or a dash
- The value and unit are joined by a no-break space, so they never wrap apart

## Props

- `value`: string (optional) — the value, formatted by the consumer
- `unit`: string (optional) — the unit, such as `mmol/L`
- `interpretation`: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as `data-interpretation`
- `flagLabel`: string (optional) — the flag in words ("High"); required when the flag is not normal
- `range`: string (optional) — the reference range as text
- `status`: "final" | "preliminary" | "not-recorded" | "unavailable" (optional) — default `final`, rendered as `data-status`
- `statusLabel`: string (optional) — the words for a status that is not final; replaces the value when it is missing
- `label`: string (optional) — hidden text naming the observation, when no visible caption does
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<SummaryList>
  <SummaryListItem term="Potassium">
    <ObservationView
      value="5.9"
      unit="mmol/L"
      interpretation="H"
      flagLabel="High"
      range="3.5–5.3"
    />
  </SummaryListItem>
  <SummaryListItem term="Sodium">
    <ObservationView
      status="not-recorded"
      statusLabel="Not recorded"
    />
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No role and no `aria-label`: a `<span>` cannot be named, so `label` renders as hidden text in a `screen-reader-span`. The flag is text, so a screen reader hears it

## When to Use

- Use to show a laboratory result or a vital sign with its unit and reference range.
- Use in a results table, a patient summary or a trend view, beside a `sparkline` of earlier values.
- Use when a result can be missing, preliminary or abnormal, and each must read differently.

## When Not to Use

- Do not use for a measurement with no clinical interpretation — use `measurement-instance-view`.
- Do not use to edit a value — use `number-input` with `field`.
- Do not use for a computed score — use `early-warning-score-view`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.observation-view` class hook, and every word.

## Styles

`.observation-view`, `.observation-view-value`, `.observation-view-unit`, `.observation-view-flag`, `.observation-view-range`, `.observation-view-status`, and the `[data-interpretation]` and `[data-status]` attributes.

## Testing

- Each part renders, and the value and unit are joined by a no-break space
- An interpretation code renders as `data-interpretation` and its consumer label as text
- `not-recorded` and `unavailable` render different words and no value
- A missing `flagLabel` for an abnormal code, or a missing `statusLabel`, raises a development warning

## Advice

- Separate new results from earlier ones, and show a trend: clinicians often look for a significant change, not the range, because some patients sit outside it permanently.
- Keep one display for a result whatever system it came from.
- Flag text comes from the consumer, translated; never show the code itself to a person.

## Related components

- `measurement-instance-view` — a read-only display of a measurement value and unit
- `sparkline` — a small inline chart showing a data trend
- `summary-list-item` — one key-value pair in a summary list

## References

- FHIR Observation: https://hl7.org/fhir/observation.html
- Spec: spec/healthcare-ui/index.md
- Adopter guide: https://github.com/LilyDesignSystem/lily-design-system/blob/main/docs/patterns/healthcare.md

---

Lily™ and Lily Design System™ are trademarks.
