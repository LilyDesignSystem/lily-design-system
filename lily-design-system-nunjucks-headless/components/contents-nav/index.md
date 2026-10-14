# ContentsNav

A contents navigation area.

## Canonical documentation

See [components/contents-nav/index.md](../../../components/contents-nav/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/contents-nav/macro.njk" import contentsNav %}

{{ contentsNav({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.

## Scrollspy

The macro only renders markup, so `spy: true` renders data attributes and `spy.js` (in this directory) does the work.

```njk
{% call contentsNav({ label: "On this page", spy: true, spyOffset: 64 }) %}
  <ol class="contents-list">
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
{% endcall %}
```

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/contents-nav/spy.js";
autoInit({ onChange: (id, nav) => console.log(id) });
```

Params: `spy`, `spyOffset` (px, default 0), `spyCurrent` (default `"true"`), `spyRoot` (CSS selector, default the viewport).

- **Which section is current:** the last one whose top has passed the activation line (`offset` px below the top of the
  scroller). At the bottom of the page the last section is current; above the first section, the first is.
- **What is set:** `aria-current` (default `"true"`) and `data-active` on that link, and `data-descendant-active` on each
  enclosing `<li>`. Style the highlight with more than colour (WCAG 1.4.1). There is no live region: scrolling announces nothing.
- **Clicks:** the clicked link becomes current at once and stays so until the scroll settles (`scrollend`, or 1 s).
- **Not done for you:** smooth scrolling (CSS `scroll-behavior` inside `prefers-reduced-motion: no-preference`), a fixed
  header's offset (`scroll-margin-top` on the targets plus the same `offset`), moving focus, and updating the URL.

