# Event

An event component that contains other event-related information.

## Canonical documentation

See [components/event/index.md](../../../components/event/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/event/macro.njk" import event %}

{{ event({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
