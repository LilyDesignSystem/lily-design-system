# AddressographBox

A passive identification block that displays consumer-supplied patient or subject details such as name, date of birth, and identifier.

## Canonical documentation

See [components/addressograph-box/index.md](../../../components/addressograph-box/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/addressograph-box/macro.njk" import addressographBox %}

{{ addressographBox({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
