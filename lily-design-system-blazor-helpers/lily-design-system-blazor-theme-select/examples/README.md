# Examples

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-theme-select`. Each file is a runnable
component that can be dropped into any Blazor 10 host (Blazor Web
App, Blazor Server, Blazor WebAssembly).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `wwwroot/assets/themes/light.css`,
  `wwwroot/assets/themes/dark.css`, …). The
  [Lily themes](../../../themes/) catalog ships 41 ready-to-use
  themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.
- The example's `@page` route is mounted in the host's `App.razor`
  with the relevant interactive render mode.

| # | File                                               | Demonstrates                                    |
|---|----------------------------------------------------|-------------------------------------------------|
| 1 | [`Basic.razor`](./Basic.razor)                     | Minimal three-theme select.                     |
| 2 | [`TwoWayBinding.razor`](./TwoWayBinding.razor)     | `@bind-Value` and `OnChange`.                   |
| 3 | [`Persistence.razor`](./Persistence.razor)         | `localStorage` survival across reloads.         |
| 4 | [`CustomLabels.razor`](./CustomLabels.razor)       | `ThemeLabels` for i18n / display names.         |
| 5 | [`CustomRendering.razor`](./CustomRendering.razor) | `RenderFragment<ThemeSelectContext>` — swatch buttons. |
| 6 | [`Preloaded.razor`](./Preloaded.razor)             | Zero-flicker switching via `<HeadContent>` preloads. |
| 7 | [`MultipleSelects.razor`](./MultipleSelects.razor) | Two selects in one page via distinct `Name`.    |
| 8 | [`SystemPreference.razor`](./SystemPreference.razor) | Follow OS `prefers-color-scheme`.             |
| 9 | [`LilyThemes.razor`](./LilyThemes.razor)           | All 41 Lily / DaisyUI themes at once.           |
| 10 | [`BlazorServerCookie/`](./BlazorServerCookie/)    | SSR-resolved theme via a cookie (Blazor Web App). |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Blazor Web App or Blazor Server project, drop the
   `.razor` file into your `Components/Pages/` directory.
2. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into
   `wwwroot/assets/themes/`.
3. `dotnet run` and visit the `@page` route declared at the top of
   the file.

## Render modes

Every example declares `@rendermode InteractiveServer` at the top.
You can swap this for `InteractiveWebAssembly` or `InteractiveAuto`
depending on your hosting model; the select's behaviour is identical
in all three modes.

For a fully-static SSR-only page (no `@rendermode` directive), the
select renders the markup but cannot mutate the DOM —
`OnAfterRenderAsync` never fires. Pair static SSR with a server-
resolved cookie strategy (see
[`BlazorServerCookie/`](./BlazorServerCookie/)).

## Two-way binding conventions

The select exposes its bindable on `Value`. Always use
`@bind-Value="theme"` in markup, and pair with `OnChange` for
one-shot side effects.

## Naming

Blazor parameters are PascalCase: `ThemesUrl`, `DefaultValue`,
`ThemeLabels`, `StorageKey`. In `@code` blocks we use camelCase
fields (`theme`, `osPreference`) per .NET conventions.
