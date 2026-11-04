# MenuBar

A horizontal bar of menu triggers.

## Canonical documentation

See [components/menu-bar/index.md](../../../components/menu-bar/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/menu-bar/macro.njk" import menuBar %}

{{ menuBar({ }) }}
```

The macro is markup only. Load the keys once, as an ES module:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/menu-bar/menu-bar.js";
autoInit();
```

ArrowRight, ArrowLeft, Home and End move between items, and a typed letter jumps to the next item that starts with it; the bar is one tab stop. Right-to-left swaps the horizontal arrows.

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `menu-bar.js` — the keys

---

Lily™ and Lily Design System™ are trademarks.
