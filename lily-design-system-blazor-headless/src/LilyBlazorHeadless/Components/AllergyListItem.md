# AllergyListItem

One allergy or intolerance in an allergy list, with substance, reaction, severity and last update.

A Blazor component that renders `<li>`.

See `components/allergy-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `Substance`: string (required) — what the patient reacts to
- `Reaction`: string (optional) — the manifestation
- `Severity`: "mild" | "moderate" | "severe" (optional) — rendered as `data-severity`
- `SeverityLabel`: string (optional) — the severity in words
- `Updated`: string (optional) — when the record was last updated, for `<time datetime>`
- `UpdatedLabel`: string (optional) — that date as the consumer writes it
- `ChildContent`: slot (optional) — anything else, such as a link to the full record

---

Lily™ and Lily Design System™ are trademarks.
