# Combobox

A text input combined with a dropdown list for filtering options.

## Canonical documentation

See [components/combobox/index.md](../../../components/combobox/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/combobox/macro.njk" import combobox %}

{{ combobox({ id: "fruit", label: "Fruit" }) }}
```

The macro is markup only. Load the behaviour once, as an ES module:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/combobox/combobox.js";
autoInit();
```

The keys, typing, blur and pointer are then the same as every other catalog. Choosing writes the value into the input and
dispatches a bubbling `combobox-select` event with `detail.value`; closing dispatches `combobox-close`. Filtering is yours.

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test
- `combobox.js` — the behaviour, copied from `shared/combobox-client.js`; edit it there
- `combobox.pattern.test.js` — the shared `combobox` contract

---

Lily™ and Lily Design System™ are trademarks.
