# DecisionSupportCard

A clinical decision support card with a summary, urgency indicator, source, suggestions and override reasons.

A Nunjucks macro, `decisionSupportCard`, that renders `<div>`: `{% from "components/decision-support-card/macro.njk" import decisionSupportCard %}`.

See `components/decision-support-card/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

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
- `caller() or html`: slot (optional) — the detail

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook story

---

Lily™ and Lily Design System™ are trademarks.
