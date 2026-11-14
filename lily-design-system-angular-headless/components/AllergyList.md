# AllergyList

A list of a patient's allergies and intolerances, whose status is never blank.

An Angular standalone component, selector `lily-allergy-list`, that renders `<ul>`.

See `components/allergy-list/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `content projection`: slot (optional) — `allergy-list-item` items

---

Lily™ and Lily Design System™ are trademarks.
