# ImmunizationRecordListItem

One immunization in an immunization record list, with vaccine, date, dose and status.

A Nunjucks macro, `immunizationRecordListItem`, that renders `<li>`: `{% from "components/immunization-record-list-item/macro.njk" import immunizationRecordListItem %}`.

See `components/immunization-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `vaccine`: string (required) — the vaccine given; never truncated
- `occurrence`: string (optional) — when it was given, for <time datetime>
- `occurrenceLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `doseNumberLabel`: string (optional) — the dose in words ("Dose 2 of 2")
- `status`: "completed" | "entered-in-error" | "not-done" (optional) — FHIR Immunization status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `lotNumber`: string (optional) — the vaccine's lot number
- `caller() or html`: slot (optional) — anything else, such as a link to the full record

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook story

---

Lily™ and Lily Design System™ are trademarks.
