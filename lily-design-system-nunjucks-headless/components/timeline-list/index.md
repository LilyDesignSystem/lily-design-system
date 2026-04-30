# TimelineList

An ordered list of chronological events or milestones.

## Canonical documentation

See [components/timeline-list/index.md](../../../components/timeline-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/timeline-list/macro.njk" import timelineList %}

{{ timelineList({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
