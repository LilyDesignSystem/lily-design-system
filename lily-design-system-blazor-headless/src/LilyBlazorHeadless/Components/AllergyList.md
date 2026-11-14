# AllergyList

A list of a patient's allergies and intolerances, whose status is never blank.

A Blazor component that renders `<ul>`.

See `components/allergy-list/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `Status`: "known" | "none-known" | "not-recorded" | "unavailable" (required) — rendered as `data-status`
- `StatusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `Label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `ChildContent`: slot (optional) — `allergy-list-item` items

---

Lily™ and Lily Design System™ are trademarks.
