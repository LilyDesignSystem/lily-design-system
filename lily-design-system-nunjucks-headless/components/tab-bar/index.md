# TabBar

A group of tabs for switching between content panels.

## Canonical documentation

See [components/tab-bar/index.md](../../../components/tab-bar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/tab-bar/macro.njk" import tabBar %}

{{ tabBar({ }) }}
```

The macro is markup only. Load the keys once, as an ES module:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/tab-bar/tab-bar.js";
autoInit();
```

ArrowRight, ArrowLeft (Up and Down when vertical), Home and End move between tabs; clicking, Enter or Space selects a tab and moves the tab stop to it. Right-to-left swaps the horizontal arrows.

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `tab-bar.js` — the keys

---

Lily™ and Lily Design System™ are trademarks.
