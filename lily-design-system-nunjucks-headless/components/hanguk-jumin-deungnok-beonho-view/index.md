# HangukJuminDeungnokBeonhoView

A read-only display for South Korea's Resident Registration Number (주민등록번호).

## Canonical documentation

See [components/hanguk-jumin-deungnok-beonho-view/index.md](../../../components/hanguk-jumin-deungnok-beonho-view/index.md) for the full component documentation.

## Nunjucks usage

```njk
{% from "components/hanguk-jumin-deungnok-beonho-view/macro.njk" import hangukJuminDeungnokBeonhoView %}

{{ hangukJuminDeungnokBeonhoView({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
