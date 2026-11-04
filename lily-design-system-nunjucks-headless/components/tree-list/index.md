# TreeList

A hierarchical list with nested expandable items.

## Canonical documentation

See [components/tree-list/index.md](../../../components/tree-list/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tree-list/macro.njk" import treeList %}

{{ treeList({ }) }}
```

The macro is markup only. Load the keys once, as an ES module:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/tree-list/tree.js";
autoInit();
```

Up, Down, Home and End move between visible items; Right and Left expand, collapse and move to a child or parent, swapped
in right-to-left; the tree is one tab stop. Hiding a collapsed item's children is your CSS.

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `tree.js` — the keys
- `tree.pattern.test.js` — the shared `tree` and `tree-expand` contracts

---

Lily™ and Lily Design System™ are trademarks.
