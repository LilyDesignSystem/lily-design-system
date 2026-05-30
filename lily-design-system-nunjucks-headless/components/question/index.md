# Question

A question is anything that asks for information, invites a response, tests knowledge, etc.

## Canonical documentation

See [components/question/index.md](../../../components/question/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/question/macro.njk" import question %}

{{ question({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook stories
