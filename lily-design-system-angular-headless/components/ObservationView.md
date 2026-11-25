# ObservationView

A read-only display of a clinical observation or test result, with its unit, reference range and interpretation flag.

An Angular standalone component, selector `lily-observation-view`, that renders `<span>`.

See `components/observation-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `value`: string (optional) — the value, formatted by the consumer
- `unit`: string (optional) — the unit, such as `mmol/L`
- `interpretation`: string (optional) — a FHIR v3 ObservationInterpretation code, rendered as `data-interpretation`
- `flagLabel`: string (optional) — the flag in words ("High"); required when the flag is not normal
- `range`: string (optional) — the reference range as text
- `status`: "final" | "registered" | "preliminary" | "amended" | "corrected" | "entered-in-error" | "cancelled" | "unknown" | "masked" | "not-recorded" | "unavailable" | "not-applicable" (optional) — default `final`, rendered as `data-status`
- `statusLabel`: string (required for any status but `final`) — the words for the status; without them no value is shown
- `showWithdrawn`: boolean (optional) — default `false`; in an authorised history view, shows an `entered-in-error` result's former value struck through after its words
- `label`: string (optional) — hidden text naming the observation, when no visible caption does

---

Lily™ and Lily Design System™ are trademarks.
