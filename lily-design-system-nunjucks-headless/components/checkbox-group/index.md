# CheckboxGroup

A group component that manages a collection of checkboxes with shared state.

## Canonical documentation

See [components/checkbox-group/index.md](../../../components/checkbox-group/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/checkbox-group/macro.njk" import checkboxGroup %}

{{ checkboxGroup({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
