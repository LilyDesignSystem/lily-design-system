# Changelog

This subproject is a directory of the canonical Lily Design System™ monorepo,
and does not keep a separate change history.

**The canonical changelog is
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).** It records every change to
this subproject, with reasoning, alongside the rest of the system.

Release highlights and project news: [NEWS.md](NEWS.md).

---

Lily™ and Lily Design System™ are trademarks.

## 0.3.1 — 2026-11-18

- **Fixed:** the plugin could not be imported. `lily-alpine.js` imports `menu-keys.js` and `widget-keys.js`, which the
  package's `files` list left out, so `import lily from "@lilydesignsystem/alpine-headless/plugin"` failed with "Cannot
  find module" in 0.3.0. Both are now shipped, and `bin/smoke-packages` imports the plugin from the packed tarball.

## 0.3.0 — 2026-11-18 (breaking)

- **Breaking:** the 164 national personal identifier components (an `-input` and a `-view` for each of 82 identifier
  types) move to their own package, `@lilydesignsystem/alpine-headless-identifiers`. They are removed, not re-exported; this package now has the 473 other
  catalog components.
- **Migration:** install `@lilydesignsystem/alpine-headless-identifiers` and import the identifier components from it; their props, class hooks and behaviour
  are unchanged.
