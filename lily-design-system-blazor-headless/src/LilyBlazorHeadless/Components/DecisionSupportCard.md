# DecisionSupportCard

A clinical decision support card with a summary, urgency indicator, source, suggestions and override reasons.

A Blazor component that renders `<div>`.

See `components/decision-support-card/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `Summary`: string (required) — the one-sentence summary (CDS Hooks: under 140 characters); names the card
- `Indicator`: "info" | "warning" | "critical" (required) — rendered as `data-indicator`
- `IndicatorLabel`: string (required) — the indicator in words
- `SourceLabel`: string (required) — where the guidance comes from
- `SourceHref`: string (optional) — a link to the source
- `Suggestions`: { id, label, isRecommended? }[] (optional) — each a button
- `Links`: { label, href }[] (optional) — links to more information
- `DismissLabel`: string (optional) — the dismiss button's text; no button without it
- `OverrideReasons`: { code, display }[] (optional) — when given, dismissing asks for one
- `OverrideReasonLabel`: string (optional) — the reason select's label
- `OverrideReasonPlaceholder`: string (optional) — the text of the select's empty first option
- `Label`: string (optional) — the accessible name, when it should differ from the summary
- `ChildContent`: slot (optional) — the detail
- `OnSuggestion`: callback (optional) — called with the chosen suggestion's id
- `OnDismiss`: callback (optional) — called with the chosen reason's code, or none when no reasons are offered

---

Lily™ and Lily Design System™ are trademarks.
