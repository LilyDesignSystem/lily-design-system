# Lily Design System™ - Web Components headless identifiers: specification

## Summary

The 188 national personal identifier components for Web Components, moved out of `@lilydesignsystem/web-components-headless` (0.12.0
removes them) into their own package, as [spec/headless-identifiers](../../spec/headless-identifiers/index.md) decides
for all ten catalogs (tasks.md P37-T2, 2026-11-18).

## Decisions

1. **The components move unchanged**: the same files, props, class hooks, ARIA and tests.
2. **No dependency on the headless package.** The helpers the components import are copies.
3. **The same build and tests** as the headless package.

## Acceptance criteria

- [x] 164 components, their tests passing (2026-11-18).
- [x] The headless package ships none of them.
- [x] The root checks find each identifier here (P37-T1).
- [ ] Published (P37-T4, maintainer approval).

---

Lily™ and Lily Design System™ are trademarks.
