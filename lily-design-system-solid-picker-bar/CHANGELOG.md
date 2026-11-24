# Changelog

This subproject is a directory of the canonical Lily Design System™ monorepo,
and does not keep a separate change history.

**The canonical changelog is
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).** It records every change to
this subproject, with reasoning, alongside the rest of the system.

Release highlights and project news: [NEWS.md](NEWS.md).

---

Lily™ and Lily Design System™ are trademarks.

## 0.5.0 — 2026-11-24

- **Behaviour change**, from `@lilydesignsystem/solid-theme-picker` 0.3.0: the theme cookie is off by default (tasks.md P41-T5c). Pass the cookie name through `themeProps` (for example `cookieName: "lily-theme"`) to keep it for a server-rendered page.

## 0.4.0 — 2026-11-23

- **Changed:** the default `themes` list has 65 entries: it gains "Light High-Contrast" and "Dark High-Contrast" (WCAG 2.2 AAA), sorted with the rest by the name shown. Pickers: `theme-picker`.
