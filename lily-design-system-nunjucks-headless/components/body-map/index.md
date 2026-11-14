# BodyMap

A picker for marking regions of the body on a consumer-supplied drawing, with a checkbox for each region.

A Nunjucks macro, `bodyMap`, that renders `<fieldset>`: `{% from "components/body-map/macro.njk" import bodyMap %}`.

See `components/body-map/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `regions`: { id, label }[] (required) — the regions, in the order the list shows them
- `selected`: string[] (optional) — the chosen region ids (bindable or controlled)
- `name`: string (optional) — the checkboxes' form name
- `caller() or html`: slot (optional) — the drawing; mark each clickable shape with `data-region`

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook story

---

Lily™ and Lily Design System™ are trademarks.
