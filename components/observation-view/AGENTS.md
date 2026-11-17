# ObservationView

## Metadata

- Component: observation-view
- PascalCase: ObservationView
- Description: a read-only display of a clinical observation or test result, with its unit, reference range and interpretation flag
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .observation-view
- Interactive: no

## Key Behaviors

- Renders `<span class="observation-view">` with parts `observation-view-value`, `-unit`, `-flag`, `-range` and `-status`
- `interpretation` is a FHIR v3 ObservationInterpretation code (`N`, `L`, `H`, `LL`, `HH`, `A`, …), rendered as `data-interpretation` and never as text
- `flagLabel` is the flag in the consumer's words; it is required whenever the flag is not normal, so the meaning is never colour alone (a development warning says so)
- `status` is a FHIR Observation status (`final`, `preliminary`, `amended`, `corrected`, `entered-in-error`, `cancelled`), or `masked`, `not-recorded`, `unavailable` or `not-applicable`, rendered as `data-status`. `cancelled`, `masked`, `not-recorded` and `unavailable` show `statusLabel` instead of the value, so a missing result is never blank or a dash; every other status but `final` shows the value with `statusLabel` beside it, so an amended, corrected or entered-in-error result never reads as a plain one
- The value and unit are joined by a no-break space, so they never wrap apart

## ARIA

- No role and no `aria-label`: a `<span>` cannot be named, so `label` renders as hidden text in a `screen-reader-span`. The flag is text, so a screen reader hears it

- It never infers an interpretation: with no `interpretation` there is no flag and no `data-interpretation`, even when a range is given, so a result whose range is missing or still loading is never shown as normal (spec/lessons/openmrs item 1)

## Keyboard

- Not interactive

## Props

- `value`: string (optional) — the value, formatted by the consumer
- `unit`: string (optional) — the unit, such as `mmol/L`
- `interpretation`: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as `data-interpretation`
- `flagLabel`: string (optional) — the flag in words ("High"); required when the flag is not normal
- `range`: string (optional) — the reference range as text
- `ranges`: { label, text }[] (optional) — further named reference ranges ("Critical", "below 2.5"), each its own `-range` part with a `-range-label` (openEHR `other_reference_ranges`)
- `previousValue`: string (optional) — a superseded value, shown in a `<del class="observation-view-previous-value">` so a reader who saw it knows it changed
- `previousLabel`: string (optional; required with `previousValue`) — the consumer's words for it ("was 5.1 until 3 Nov"), since a screen reader may not announce `<del>`
- `status`: "final" | "preliminary" | "amended" | "corrected" | "entered-in-error" | "cancelled" | "masked" | "not-recorded" | "unavailable" | "not-applicable" (optional) — default `final`, rendered as `data-status`
- `statusLabel`: string (optional) — the words for a status that is not final; replaces the value when it is missing
- `label`: string (optional) — hidden text naming the observation, when no visible caption does
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> with class="observation-view"
- [x] Each part renders, and the value and unit are joined by a no-break space
- [x] An interpretation code renders as `data-interpretation` and its consumer label as text
- [x] `not-recorded` and `unavailable` render different words and no value; `cancelled` and `masked` replace the value with their words; `amended`, `corrected` and `entered-in-error` show the value with their words
- [x] A missing `flagLabel` for an abnormal code, or a missing `statusLabel`, raises a development warning
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .observation-view in css-style-sheet-template.css
- FHIR Observation: https://hl7.org/fhir/observation.html
- Spec: spec/healthcare-ui/index.md
