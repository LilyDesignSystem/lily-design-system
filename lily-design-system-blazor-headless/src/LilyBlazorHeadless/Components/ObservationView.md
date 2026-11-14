# ObservationView

A read-only display of a clinical observation or test result, with its unit, reference range and interpretation flag.

A Blazor component that renders `<span>`.

See `components/observation-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `Value`: string (optional) — the value, formatted by the consumer
- `Unit`: string (optional) — the unit, such as `mmol/L`
- `Interpretation`: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as `data-interpretation`
- `FlagLabel`: string (optional) — the flag in words ("High"); required when the flag is not normal
- `Range`: string (optional) — the reference range as text
- `Status`: "final" | "preliminary" | "not-recorded" | "unavailable" (optional) — default `final`, rendered as `data-status`
- `StatusLabel`: string (optional) — the words for a status that is not final; replaces the value when it is missing
- `Label`: string (optional) — hidden text naming the observation, when no visible caption does

---

Lily™ and Lily Design System™ are trademarks.
