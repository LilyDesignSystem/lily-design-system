# Lily Design System — Blazor Helpers

A catalog of opinionated, reusable Blazor helper components that sit
alongside the headless [`lily-design-system-blazor-headless`](../lily-design-system-blazor-headless/)
library. Where the headless library ships pure markup primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                                  | Purpose                                                        |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`lily-design-system-blazor-theme-select`](./lily-design-system-blazor-theme-select/)   | Pick a visual theme; dynamic CSS load + `data-theme` swap.     |
| [`lily-design-system-blazor-locale-select`](./lily-design-system-blazor-locale-select/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |
| [`lily-design-system-blazor-text-size-select`](./lily-design-system-blazor-text-size-select/) | Pick a text size; sets `data-text-size` on the document root. |

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-blazor-<name>/
├── spec.md                  ← single source of truth (SDD)
├── AGENTS.md                ← AI-agent metadata pointer
├── CLAUDE.md                ← loads AGENTS.md
├── index.md                 ← comprehensive user guide
├── {Pascal}.razor           ← component markup
├── {Pascal}.razor.cs        ← C# code-behind (partial class)
├── {Pascal}Tests.cs         ← bUnit + xUnit spec (one [Fact] per §7 item)
├── AGENTS/                  ← topic-by-topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── docs/                    ← human-readable topic guides
├── examples/                ← runnable .razor pages and components
└── CHANGELOG.md             ← per-helper version history
```

The catalog parent ships its own `AGENTS/` and `AGENTS/shared/`
directories with conventions, testing, accessibility, and SSR rules,
plus the Lily-wide headless / i18n / theme principles ported from
the root canonical AGENTS files.

Shared design decisions across the catalog:

- **Blazor 10 / .NET 10**. `Nullable enable`, `ImplicitUsings enable`,
  `LangVersion = preview`.
- **Partial-class component shape**. Every helper is `{Pascal}.razor`
  (markup) plus `{Pascal}.razor.cs` (code-behind) so C# tooling stays
  first-class.
- **Namespace**: `LilyDesignSystem.Blazor.Helpers` everywhere.
- **TypeScript on the public surface? No — C# 12+**. Public surface
  is `[Parameter]` properties, `EventCallback<T>` events, and
  `RenderFragment<TContext>` for custom rendering.
- **Headless**: no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect via a kebab-case class hook.
- **SSR-safe**: every DOM write goes through `IJSRuntime` and is
  gated on `OnAfterRenderAsync(firstRender)` so the components work
  under Blazor Server, Blazor WebAssembly, and static SSR /
  prerender hosting models.
- **i18n-clean**: every user-facing string comes from a parameter.
- **One job per helper**: each helper owns the entire lifecycle of
  one user-preference dimension (theme, language, etc.) and composes
  cleanly with the others.
- **Spec-driven**: every helper has a `spec.md` numbered with §
  references; tests assert against those numbers; docs link back.

## Differences from the headless library

The headless library mirrors the canonical 492-component catalog.
Each component is a pure container with no lifecycle — a consumer
typing on top of `ThemeSelect` from `lily-design-system-blazor-headless`
writes their own option markup, their own persistence, and their own
loading.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application, and
they expose a smaller, more opinionated API. Both layers can coexist
in one app; the helpers are not a replacement.

## Blazor idioms used throughout

The helpers commit to a small set of Blazor / .NET 10 features:

- `@namespace LilyDesignSystem.Blazor.Helpers` in every `.razor` file.
- `partial class` split between `{Pascal}.razor` and `{Pascal}.razor.cs`.
- `[Parameter, EditorRequired]` for required parameters; the IDE
  flags missing ones at compile time.
- `[Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>?
  AdditionalAttributes` for HTML attribute spread.
- `EventCallback<T>` and `EventCallback.Factory.Create` for typed,
  cross-renderer event flow. Two-way binding via the
  `{Name}` + `{Name}Changed` parameter convention drives
  `@bind-{Name}` in consumer markup.
- `RenderFragment<TContext>` for "custom rendering" (the .NET
  equivalent of React render-props, Vue scoped slots, and Svelte
  snippets). Each helper exposes a strongly-typed `*Context` record
  passed to the consumer's fragment.
- `IJSRuntime` injection (`[Inject] private IJSRuntime JS { get; set; }`)
  for DOM mutation. All interop is gated on `OnAfterRenderAsync` so
  the component never throws during prerender.
- `Microsoft.Extensions.Localization` (`IStringLocalizer<T>`) is the
  consumer's wire for translated strings; the helpers don't take a
  dependency on it.

These choices map 1:1 to the Svelte canonical helpers so behaviour
and tests stay in lock-step across frameworks.

## Hosting models supported

All helpers compile and run cleanly under all four Blazor 10 hosting
models:

| Model                              | DOM access            | Initial render | Helper behaviour                               |
| ---------------------------------- | --------------------- | -------------- | ---------------------------------------------- |
| **Blazor Server**                  | via SignalR + JS      | server         | Markup renders server-side. `OnAfterRenderAsync(true)` fires once the circuit is established; JS interop runs and the DOM mutations land. |
| **Blazor WebAssembly**             | direct, after WASM    | client         | Markup renders client-side after the WASM module loads. `OnAfterRenderAsync(true)` fires; JS interop runs synchronously. |
| **Blazor Web App (static SSR)**    | none (prerender only) | server         | Markup renders during prerender. No JS interop. The select waits for interactivity. |
| **Blazor Web App (interactive)**   | via SignalR / WASM    | server, then hydrates | Prerender renders the markup; hydration fires `OnAfterRenderAsync(true)`; interop lands. |

See [`AGENTS/ssr.md`](./AGENTS/ssr.md) for the strategy each helper
uses to stay safe under static SSR.

## Sibling helper catalogs

- [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  — the canonical Svelte 5 reference implementation. When the Blazor
  port and the Svelte canonical disagree, the Svelte side wins and
  the Blazor side is patched.
- [`lily-design-system-vue-helpers`](../lily-design-system-vue-helpers/)
  — Vue 3 port. Same DOM contract, same §7 acceptance numbering.

## Testing

Each helper ships a bUnit + xUnit suite. The acceptance criteria are
listed in each `spec.md` §7 and the test file matches one `[Fact]`
per numbered item, named with the section number for fast
cross-referencing.

```bash
cd lily-design-system-blazor-theme-select
dotnet test
```

The shared rules around test setup (`bUnit.TestContext`,
`JSInterop.Mode = JSRuntimeMode.Loose`, `JSInterop.SetupVoid("eval", _ => true)`,
`Task.Yield` to settle `OnAfterRenderAsync`) live in
[`AGENTS/testing.md`](./AGENTS/testing.md).

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.
