# ContentsLink

One table of contents link.

## Canonical documentation

See [components/contents-link/index.md](../../../components/contents-link/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/contents-link/macro.njk" import contentsLink %}

{{ contentsLink({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.

## Count

`countLabel` (with an optional `count`) shows a visible, localised count inside the link, after the text, so the link's
accessible name includes it; `count` sets `data-count` (and `data-complete` at 0). The count is text, never colour alone
(WCAG 1.4.1), and an `aria-label` replaces the whole name, so include the count in it if you set one.
See the canonical `components/contents-link/index.md`.
