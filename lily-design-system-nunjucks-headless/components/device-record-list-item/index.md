# DeviceRecordListItem

One medical device in a device record list, with its status and when it was used.

A Nunjucks macro, `deviceRecordListItem`, that renders `<li>`: `{% from "components/device-record-list-item/macro.njk" import deviceRecordListItem %}`.

See `components/device-record-list-item/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `device`: string (required) — the device; never truncated
- `status`: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold" (optional) — FHIR DeviceUseStatement status; rendered as `data-status`
- `statusLabel`: string (optional; required when `status` is set) — the status in words
- `timing`: string (optional) — when it was used, for <time datetime>
- `timingLabel`: string (optional) — that date as the consumer writes it; the `<time>` shows only when set
- `caller() or html`: slot (optional) — anything else, such as a link to the full record

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook story

---

Lily™ and Lily Design System™ are trademarks.
