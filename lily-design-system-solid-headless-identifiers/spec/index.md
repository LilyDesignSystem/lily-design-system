# Lily Design System™ - Solid headless identifiers: specification

## Summary

The 188 national personal identifier components for Solid 2.0, moved out of `@lilydesignsystem/solid-headless` (0.2.0
removes them) into their own package, as [spec/headless-identifiers](../../spec/headless-identifiers/index.md) decides
for all ten catalogs (tasks.md P37-T2, 2026-11-18).

## Decisions

1. **The components move unchanged**: the same files, props, class hooks, ARIA and tests.
2. **No dependency on `solid-headless`.** The helpers the components import (`defaults`, `dev-warning`) are copies.
3. **The same build** as `solid-headless` (`build.mjs`: the barrel, the `solid` source build and the compiled bundle).

## Acceptance criteria

- [x] 164 components, 892 tests passing (2026-11-18).
- [x] `solid-headless` ships none of them, and its 473 components' 3,111 tests pass.
- [x] The root checks find each identifier here (P37-T1).
- [ ] Published (P37-T4, maintainer approval).

---

Lily™ and Lily Design System™ are trademarks.
