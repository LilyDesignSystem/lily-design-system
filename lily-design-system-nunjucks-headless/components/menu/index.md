# Menu

A list of actions or options triggered by a button.

## Canonical documentation

See [components/menu/index.md](../../../components/menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/menu/macro.njk" import menu %}

{{ menu({ }) }}
```

The macro is markup only. Load the keys once, as an ES module:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/menu/menu.js";
autoInit();
```

ArrowDown, ArrowUp, Home and End move between items, and a typed letter jumps to the next item that starts with it; the menu is one tab stop. Right-to-left swaps the horizontal arrows.

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `menu.js` — the keys

---

Lily™ and Lily Design System™ are trademarks.
