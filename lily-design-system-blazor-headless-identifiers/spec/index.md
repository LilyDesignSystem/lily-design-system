# Lily Design System™ - Blazor headless identifiers: specification

## Summary

The 188 national personal identifier components for Blazor, moved out of `LilyDesignSystem.Blazor.Headless` (0.11.0
removes them) into their own package, as [spec/headless-identifiers](../../spec/headless-identifiers/index.md) decides
for all ten catalogs (tasks.md P37-T2, 2026-11-18).

## Decisions

1. **The components move unchanged**: the same files, props, class hooks, ARIA and tests.
2. **It depends on the headless package**, unlike the other nine catalogs: every identifier input extends
   `ValueInputBase`, and a copy would be a second public `LilyBlazorHeadless.Components.ValueInputBase` that no app
   could reference beside the headless package. The components keep their namespace, so an app's `@using` is unchanged.
3. **The same SDK and tests**: a Razor class library and a bUnit test project.

## Acceptance criteria

- [x] 164 components, their tests passing (2026-11-18).
- [x] The headless package ships none of them.
- [x] The root checks find each identifier here (P37-T1).
- [ ] Published (P37-T4, maintainer approval).

---

Lily™ and Lily Design System™ are trademarks.
