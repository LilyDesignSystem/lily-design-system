# Changelog — Lily Design System Blazor Helpers

All notable changes to this catalog are documented in this file. The
catalog version mirrors the highest-versioned helper at release time.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Changed (BREAKING)

- `theme-select` and `locale-select` are no longer native `<select>`
  elements. Each is now an **icon button that opens a dropdown
  listbox**, built to the WAI-ARIA APG listbox pattern: a root
  `<div class="{helper}">`, a hidden `<input>` carrying `Name` /
  `Value` for form participation, a
  `<button class="{helper}-button" aria-haspopup="listbox">` wrapping an
  `aria-hidden` glyph (`◑` U+25D1 for theme, `🌐` U+1F310 for locale),
  and a `<ul class="{helper}-list" role="listbox" tabindex="-1" hidden>`
  of `<li role="option" aria-selected data-active>`. locale-select
  options keep their per-locale `lang`; the button and list carry none.
- This **supersedes the 0.3.0 placeholder-pinning work**. There is no
  `<select>` left to pin, so the `Placeholder` parameter is removed from
  both helpers, the `.{helper}-placeholder` CSS hook is gone, and the
  `Object.assign(el, { value: "" })` snap-back interop write is deleted.
- `ChildContent` changes meaning: it now **replaces the glyph inside the
  button** and receives a narrowed context of `{ Value, Open, LabelFor }`.
  It no longer renders options — those are component-owned, so the
  listbox semantics (and locale-select's per-option `lang`) cannot be
  broken by a consumer override. `ThemeSelectContext` drops `Themes`,
  `SetTheme` and `Name`; `LocaleSelectContext` drops `Locales`,
  `SetLocale`, `Name`, `TagFor` and `IsRtl` — those pure helpers remain
  as statics on the `Locales` class. Imperative selection is now
  `SetThemeAsync` / `SetLocaleAsync` via a `@ref`.
- Consumers must update any CSS or test selector targeting
  `select.{helper}` or `option.{helper}-option`, and note that
  `CssClass` and `AdditionalAttributes` now land on a root `<div>`
  rather than on a form control.
- `text-size-select` is untouched and keeps its native `<select>`.

### Added

- The full APG listbox keyboard contract in both helpers, implemented
  by the component rather than inherited from the browser: `ArrowDown` /
  `Enter` / `Space` open on the selected option and `ArrowUp` opens on
  the last; arrows move and **clamp** (no wrapping); `Home` / `End`
  jump; `Enter` / `Space` select-apply-close-and-refocus; `Escape`
  closes without changing the value; `Tab` closes without stealing
  focus; printable characters run a 500 ms typeahead over the labels.
  Clicking an option selects it; focus leaving the root closes.
- Focus management via `ElementReference.FocusAsync()`, deferred to
  `OnAfterRenderAsync` because the listbox cannot take focus while it
  still carries `hidden`.
- Public glyph constants `ThemeSelect.CircleWithRightHalfBlack` and
  `LocaleSelect.GlobeWithMeridians`.
- Stable, SSR-safe element ids from a monotonic process-wide counter —
  no randomness and no clock reads.

### Notes

- The status-region pattern survives the rewrite and stays the
  recommendation, but for a different reason: the selection *is* now
  readable off the control (one option carries `aria-selected="true"`),
  so the status region compensates for the closed button being a bare
  glyph rather than for missing semantics.
- Each package's `docs/accessibility.md` replaces the retired
  placeholder tradeoff with the three real ones: an icon-only control
  depends entirely on `aria-label`; a custom listbox has weaker
  assistive-technology support than a native `<select>`; and the glyph
  is a font character that may render differently or be missing
  depending on the platform.
- Two clauses of the canonical Svelte contract could not be ported
  faithfully to Blazor — no `preventDefault` on keydown (Blazor
  evaluates it at render time and so cannot spare `Tab`; a
  suppress-next-click flag stops `Enter` / `Space` double-toggling),
  and no document-level click listener (the packages ship no
  JavaScript; the root's `focusout` closes instead). Both are recorded
  in each spec and in `docs/accessibility.md`.

## 0.3.0 — 2026-07-20

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.3.0**: both are now
  *placeholder-pinned*. The closed `<select>` always displays a short
  placeholder word ("Theme", "Locale") instead of the active value, so
  the control is only ever as wide as that word rather than as wide as
  the longest option. Each renders a leading placeholder `<option>` with
  an empty value, carrying a new optional `placeholder` prop (defaults
  to the existing `label`, so no user-facing string is hardcoded), and
  pins the element's own selection to it — snapping back after every
  change.
- DOM contract: option count is `choices.length + 1`, the first option's
  value is `""`, and the element's own `value` no longer tracks the
  selection. The bindable `value` prop is the single source of truth.
  Behaviour contracts (DOM application, persistence, SSR safety, i18n)
  are otherwise unchanged.
- `text-size-select` is untouched and stays at **0.1.0**.

### Added

- The compensating status region is now the default pattern in the
  examples and quick-starts: a visible `aria-live="polite"` element
  reporting the active value. It exists because placeholder-pinning
  means the control no longer announces its value to a screen reader;
  each package's `docs/accessibility.md` documents that tradeoff
  honestly rather than treating it as solved.

## 0.2.0 — 2026-07-03

### Changed (BREAKING)

- `theme-select` and `locale-select` bumped to **0.2.0**: migrated from
  the radio-group "picker" rendering to a native `<select>` with
  `<option>` children (landed in-tree 2026-06-17), with renamed packages
  (`*-picker` → `*-select`), changed class hooks, and native `<select>`
  keyboard semantics. Behaviour contracts (DOM application, persistence,
  SSR safety, i18n) are unchanged.

### Added

- `text-size-select` **0.1.0** — native-`<select>` text-size helper that
  sets `data-text-size` on the document root, with optional
  `localStorage` persistence (added 2026-06-17; born select-based, so it
  carries no picker migration).

## 0.1.0 — 2026-06-05

Initial release. Two helpers ported from the Svelte canonical
catalog:

### Added

- `lily-design-system-blazor-theme-select` v0.1.0 — runtime-loading
  theme select with `data-theme` swap, `<link>`-based stylesheet
  injection, `localStorage` persistence, and a `RenderFragment<ThemeSelectContext>`
  for custom rendering. Fully mirrors the Svelte canonical contract;
  13 acceptance criteria covered.
- `lily-design-system-blazor-locale-select` v0.1.0 — BCP 47 locale
  select that writes `lang` and `dir` on the document root, with
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
- Tests use bUnit + xUnit, one `[Fact]` per `spec/index.md` §7 clause.

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
