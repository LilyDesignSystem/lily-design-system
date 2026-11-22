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
- `meterValue`, `meterMin`, `meterMax`: number (optional) — with all three, an `aria-hidden` native `<meter class="observation-view-meter">` shows where the value sits; `meterLow`, `meterHigh` and `meterOptimum` (optional) mark the reference range and best value for the theme. It is the picture of the words, never the only signal: the value, range and flag stay text. No meter for a missing result `meterScale(value, low?, high?, units?)` in the `clinical-format` module (C# `ClinicalFormat.MeterScale`) works out `meterMin`, `meterMax`, `meterLow` and `meterHigh` from a value and its reference range: half a range beyond each end of a two-sided range, zero to half as far again for a one-sided one, always wide enough to hold the value, and nothing (so no meter) only when there is no value or no range; a non-numeric value or end, a reversed range, a bound not above zero, or two different units throws a `MeterScaleError` (C# `MeterScaleException`) with a `reason`, never a quiet fallback (2026-11-21, P42-T8; 2026-11-22, checked arithmetic).
- `previousValue`: string (optional) — a superseded value, shown in a `<del class="observation-view-previous-value">` so a reader who saw it knows it changed
- `previousLabel`: string (optional; required with `previousValue`) — the consumer's words for it ("was 5.1 until 3 Nov"), since a screen reader may not announce `<del>`
- `status`: "final" | "preliminary" | "amended" | "corrected" | "entered-in-error" | "cancelled" | "masked" | "not-recorded" | "unavailable" | "not-applicable" (optional) — default `final`, rendered as `data-status`
- `statusLabel`: string (optional) — the words for a status that is not final; replaces the value when it is missing
- `label`: string (optional) — hidden text naming the observation, when no visible caption does
- `...restProps`: any — additional HTML attributes spread onto the root

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). The rules are shared as `ObservationRules` in `LilyCore` and `lily-core`, one test each.

- Apple: `ObservationView(value:unit:interpretation:flagLabel:range:ranges:status:statusLabel:previousValue:previousLabel:label:meter:)` in `LilyUI`: one VoiceOver element speaking the label, value and unit (no-break space), flag, ranges, status and previous value in order; a missing result speaks its status words; the meter is a `Gauge` hidden from VoiceOver, given as a `MeterReading`, which throws for a value off its scale (never clamped). Missing words print a development warning in debug builds. Style: `ObservationViewStyle`.
- Android: `ObservationView(…)` in `lily-compose`: the same rules as one TalkBack stop; the meter is a `Canvas` bar hidden from TalkBack, given as a `MeterReading` that `require`s a value on its scale; warnings go to `Log.w` unless `LilyWarnings.enabled = false`.

## Acceptance Criteria

- [x] Renders <span> with class="observation-view"
- [x] Each part renders, and the value and unit are joined by a no-break space
- [x] An interpretation code renders as `data-interpretation` and its consumer label as text
- [x] `not-recorded` and `unavailable` render different words and no value; `cancelled` and `masked` replace the value with their words; `amended`, `corrected` and `entered-in-error` show the value with their words
- [x] A missing `flagLabel` for an abnormal code, or a missing `statusLabel`, raises a development warning
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .observation-view in css-style-sheet-template.css
- FHIR Observation: https://hl7.org/fhir/observation.html
- Spec: spec/healthcare-ui/index.md
