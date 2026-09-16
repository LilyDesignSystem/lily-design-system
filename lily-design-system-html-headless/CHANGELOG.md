# Changelog — @lilydesignsystem/html-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-html-headless` → `@lilydesignsystem/html-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-html-headless`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.1.0 — 2026-08-26

First published release: the annotated semantic-HTML snippet library,
covering all 491 catalog components with per-component tests.

Numbered 0.1.0 deliberately. In-tree version numbers existed before
this release, but nothing was ever published under this name, and a
first release numbered higher would imply registry history that never
existed — the same reasoning the helper packages recorded at their
July 2026 reset. Sibling packages (svelte, react, vue) are on their
own version lines.
