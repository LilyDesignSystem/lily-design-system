# AllergyListItem

One allergy or intolerance in an allergy list, with substance, reaction, severity and last update.

A Vue 3 component that renders `<li>`.

See `components/allergy-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `substance`: string (required) — what the patient reacts to
- `reaction`: string (optional) — the manifestation
- `severity`: "mild" | "moderate" | "severe" (optional) — rendered as `data-severity`
- `severityLabel`: string (optional) — the severity in words
- `updated`: string (optional) — when the record was last updated, for `<time datetime>`
- `updatedLabel`: string (optional) — that date as the consumer writes it
- `default slot`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.
