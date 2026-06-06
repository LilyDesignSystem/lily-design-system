# Changelog — Lily Design System Blazor Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-06-05

Initial release. Two helpers ported from the Svelte canonical
catalog:

### Added

- `lily-design-system-blazor-theme-picker` v0.1.0 — runtime-loading
  theme picker with `data-theme` swap, `<link>`-based stylesheet
  injection, `localStorage` persistence, and a `RenderFragment<ThemePickerContext>`
  for custom rendering. Fully mirrors the Svelte canonical contract;
  13 acceptance criteria covered.
- `lily-design-system-blazor-locale-picker` v0.1.0 — BCP 47 locale
  picker that writes `lang` and `dir` on the document root, with
  optional `localStorage` persistence and `navigator.languages`
  detection. Built-in 436-row locale-name table and RTL detection.
  23 acceptance criteria covered.
- Parent-level `AGENTS/` with `conventions.md`, `testing.md`,
  `accessibility.md`, `ssr.md`.
- Parent-level `AGENTS/shared/` with `headless-principles.md`,
  `i18n-principles.md`, `theme-principles.md` adapted from the
  Lily-wide root `AGENTS/`.
- Each helper subproject ships `AGENTS/`, `docs/`, and `examples/`
  subdirectories mirroring the Svelte canonical depth.

### Conventions established

- Partial-class component shape: `{Pascal}.razor` + `{Pascal}.razor.cs`.
- Namespace: `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters.
- `EventCallback<T>` for events; `{Name}` + `{Name}Changed` for
  `@bind-{Name}`.
- `[Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>?
  AdditionalAttributes` for attribute spread.
- `RenderFragment<TContext>` for custom rendering (the .NET analogue
  of React render-props / Vue scoped slots / Svelte snippets).
- All DOM writes go through `IJSRuntime` inside `OnAfterRenderAsync`
  so the components are SSR / prerender safe.
- Zero CSS shipped — consumer styles the kebab-case class hook.
- Tests use bUnit + xUnit, one `[Fact]` per `spec.md` §7 clause.

### Differences from the Svelte canonical

| Concept                 | Svelte canonical                       | Blazor port                                |
| ----------------------- | -------------------------------------- | ------------------------------------------ |
| Two-way binding         | `bind:value`                           | `@bind-Value`                              |
| Reactive state          | `$state`, `$bindable`                  | `[Parameter]` + `StateHasChanged`          |
| Reactive side-effects   | `$effect`                              | `OnAfterRenderAsync`                       |
| Render props / slots    | Snippet (`{#snippet children(...)}`)   | `RenderFragment<TContext>`                 |
| Stylesheet head         | `<svelte:head>`                        | `IJSRuntime` + `eval` (or `<HeadContent>`) |
| Cookie / SSR            | `hooks.server.ts` + `transformPageChunk` | Endpoint + `HttpContext.Request.Cookies` |
| File ext for components | `.svelte`                              | `.razor` + `.razor.cs`                     |
| Pure-helper exports     | Named exports from `.svelte` module    | `internal static` methods + `public static class Locales` |

The DOM contract and behaviour are otherwise identical; the tests
match clause-for-clause.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
