# Answer

An answer is anything that responds to a question, request, action, etc.

## Canonical documentation

See [components/answer/index.md](../../../components/answer/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/answer/macro.njk" import answer %}

{{ answer({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook stories
