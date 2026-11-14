# AllergyList

A list of a patient's allergies and intolerances, whose status is never blank.

A Nunjucks macro, `allergyList`, that renders `<ul>`: `{% from "components/allergy-list/macro.njk" import allergyList %}`.

See `components/allergy-list/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `caller() or html`: slot (optional) — `allergy-list-item` items

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook story

---

Lily™ and Lily Design System™ are trademarks.
