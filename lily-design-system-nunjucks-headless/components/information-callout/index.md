# InformationCallout

A callout box highlighting informational content.

## Canonical documentation

See [components/information-callout/index.md](../../../components/information-callout/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/information-callout/macro.njk" import informationCallout %}

{{ informationCallout({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
