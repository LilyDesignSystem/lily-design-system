# Changelog — `<lily-motion-picker>` (Web Components helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-web-components-motion-picker` → `@lilydesignsystem/web-components-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-web-components-motion-picker`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.1.0 — 2026-09-03

First release under this name. This package is a maintainer-directed
independent copy of the HTML helper of the same picker
(`@lilydesignsystem/html-motion-picker`), differing only in the tag it
registers (`<lily-motion-picker>` rather than `<motion-picker>`) and its package name.
Any entries below are that package's history, inherited so the
reasoning behind the code is not lost; none of them was released under
this name, and a first release is numbered 0.1.0 whatever the tree
carried (see `docs/releasing.md`).
