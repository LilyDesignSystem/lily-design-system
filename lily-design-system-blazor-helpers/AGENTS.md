# AGENTS — Lily Blazor Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [AGENTS/conventions.md](./AGENTS/conventions.md).

## Helpers currently in the catalog

- [`lily-design-system-blazor-theme-picker`](./lily-design-system-blazor-theme-picker/) — dynamic theme CSS loader.
- [`lily-design-system-blazor-locale-picker`](./lily-design-system-blazor-locale-picker/) — `lang` + `dir` locale select.
- [`lily-design-system-blazor-text-size-picker`](./lily-design-system-blazor-text-size-picker/) — `data-text-size` text-size select.
- [`lily-design-system-blazor-share-picker`](./lily-design-system-blazor-share-picker/) — share via the native sheet or a list of consumer-supplied destinations, plus copy-the-URL. Owns an _action_, not a preference: applies nothing, persists nothing.
- [`lily-design-system-blazor-date-time-picker`](./lily-design-system-blazor-date-time-picker/) — a headless date/time-picking form control: a text field plus an icon button opening a WAI-ARIA APG Date Picker Dialog. Owns a _form value_, not a preference or an action: applies nothing, persists nothing.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- Blazor 10 / .NET 10. `partial class` split between `{Pascal}.razor`
  and `{Pascal}.razor.cs`. Namespace
  `LilyDesignSystem.Blazor.Helpers` everywhere.
- `[Parameter, EditorRequired]` for required parameters;
  `EventCallback<T>` for events; `RenderFragment<TContext>` for
  custom rendering; `[Parameter(CaptureUnmatchedValues = true)]`
  for attribute spread.
- All DOM mutation (`<link>` swap, `data-theme`, `lang`, `dir`,
  `localStorage`) goes through `IJSRuntime` inside
  `OnAfterRenderAsync` so the components are SSR / prerender safe.
- Tests use bUnit + xUnit. One `[Fact]` per numbered §7 acceptance.
- No hardcoded user-facing strings; everything comes from parameters.
- The canonical reference is the parallel
  [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  catalog; Blazor helpers are direct ports with framework idioms
  swapped.

## Layout of this catalog

```
lily-design-system-blazor-helpers/
├── AGENTS.md                ← this file
├── AGENTS/
│   ├── conventions.md       ← Blazor-specific file shape, idioms
│   ├── testing.md           ← bUnit + xUnit harness
│   ├── accessibility.md     ← WCAG 2.2 AAA, Razor-specific gotchas
│   ├── ssr.md               ← Blazor Server / WASM / Static SSR
│   └── shared/
│       ├── headless-principles.md
│       ├── i18n-principles.md
│       └── theme-principles.md
├── CLAUDE.md                ← `@AGENTS.md`
├── index.md                 ← catalog overview
├── CHANGELOG.md             ← parent-level version history
├── lily-design-system-blazor-theme-picker/    ← helper 1
├── lily-design-system-blazor-locale-picker/   ← helper 2
├── lily-design-system-blazor-text-size-picker/ ← helper 3
├── lily-design-system-blazor-share-picker/    ← helper 4
└── lily-design-system-blazor-date-time-picker/ ← helper 5
```

## Topic index (parent)

| Topic           | Path                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| File shape      | [AGENTS/conventions.md](./AGENTS/conventions.md)                               |
| Testing harness | [AGENTS/testing.md](./AGENTS/testing.md)                                       |
| Accessibility   | [AGENTS/accessibility.md](./AGENTS/accessibility.md)                           |
| SSR / hosting   | [AGENTS/ssr.md](./AGENTS/ssr.md)                                               |
| Headless rules  | [AGENTS/shared/headless-principles.md](./AGENTS/shared/headless-principles.md) |
| i18n rules      | [AGENTS/shared/i18n-principles.md](./AGENTS/shared/i18n-principles.md)         |
| Theme rules     | [AGENTS/shared/theme-principles.md](./AGENTS/shared/theme-principles.md)       |
