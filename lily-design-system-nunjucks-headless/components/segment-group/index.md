# SegmentGroup

A group of mutually exclusive segment options.

## Canonical documentation

See [components/segment-group/index.md](../../../components/segment-group/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/segment-group/macro.njk" import segmentGroup %}

{{ segmentGroup({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
