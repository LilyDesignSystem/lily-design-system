# AnnouncementBanner

A banner highlighting important messages for all users.

## Canonical documentation

See [components/announcement-banner/index.md](../../../components/announcement-banner/index.md) for the full component documentation, including ARIA, keyboard interactions, params, and usage guidance.

## Nunjucks usage

```njk
{% from "components/announcement-banner/macro.njk" import announcementBanner %}

{{ announcementBanner({ }) }}
```

## Files

- `macro.njk` — Nunjucks macro implementation
- `macro.test.js` — vitest render test

---

Lily™ and Lily Design System™ are trademarks.
