# Comment

A comment is anything that expresses an opinion, observation, explanation, etc.

## Canonical documentation

See [components/comment/index.md](../../../components/comment/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/comment/macro.njk" import comment %}

{{ comment({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook stories
