# HamburgerMenu

A toggle button that opens a mobile navigation menu.

## Canonical documentation

See [components/hamburger-menu/index.md](../../../components/hamburger-menu/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/hamburger-menu/macro.njk" import hamburgerMenu %}

{% call hamburgerMenu({ id: "site-menu", label: "Main menu" }) %}
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
{% endcall %}
```

The macro is markup. Load the behaviour once:

```js
import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/hamburger-menu/hamburger-menu.js";

autoInit();
```

The navigation stays in the markup and is `hidden` while closed, so a page without the script can still render it open with
`open: true`.

## Files

- `macro.njk` — Nunjucks macro implementation
- `hamburger-menu.js` — the toggle
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
