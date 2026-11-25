# ProblemRecordList

A list of a patient's problems and conditions, whose status is never blank.

A Nunjucks macro, `problemRecordList`, that renders `<ul>`: `{% from "components/problem-record-list/macro.njk" import problemRecordList %}`.

See `components/problem-record-list/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `status`: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as `data-status`
- `statusLabel`: string (required) — the status in words; names the list, and is its one item unless status is `known`
- `label`: string (optional) — the accessible name, when it should differ from `statusLabel`
- `conflictLabel`: string (optional) — your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; the list never says both
- `caller() or html`: slot (optional) — `problem-record-list-item` items

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook story

---

Lily™ and Lily Design System™ are trademarks.
