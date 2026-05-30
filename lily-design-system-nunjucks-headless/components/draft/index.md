# Draft

A passive container that marks unfinished or in-progress content, with an optional status data attribute.

## Canonical documentation

See [components/draft/index.md](../../../components/draft/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/draft/macro.njk" import draft %}

{{ draft({
  label: "Draft article",
  status: "in-progress",
  html: "<p>Opening paragraph still needs a hook.</p>"
}) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `macro.stories.ts` — Storybook stories
