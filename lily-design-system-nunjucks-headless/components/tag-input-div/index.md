# TagInputDiv

An input for adding and removing tags.

## Canonical documentation

See [components/tag-input-div/index.md](../../../components/tag-input-div/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tag-input-div/macro.njk" import tagInputDiv %}

{{ tagInputDiv({ id: "tags", label: "Tags", tags: tags, removeLabel: removeLabel }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `tag-input-div.js` — `initTagInputDiv(root)`: Enter fires `tag-input-div-add`, and a remove button takes its tag out and fires `tag-input-div-remove`
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
