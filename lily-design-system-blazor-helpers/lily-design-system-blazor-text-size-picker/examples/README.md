# Examples

Self-contained Blazor `.razor` examples for
`lily-design-system-blazor-text-size-chooser`. Each file is a runnable
component that can be dropped into any Blazor 10 host (Blazor Web App,
Blazor Server, Blazor WebAssembly).

Every example assumes:

- Your stylesheet maps each `[data-text-size="<slug>"]` on `:root` to a
  relative font size — see
  [`../docs/styling.md`](../docs/styling.md#mapping-slugs-to-typography).
  Without that mapping the control works but nothing visibly resizes.
- The root and list are positioned (`position: relative` /
  `position: absolute`), or an open dropdown shoves the page around.
  The package ships no CSS.
- The example's `@page` route is mounted in the host's `App.razor`
  with the relevant interactive render mode.

| # | File                                               | Demonstrates                                    |
|---|----------------------------------------------------|-------------------------------------------------|
| 1 | [`Basic.razor`](./Basic.razor)                     | Minimal four-size select plus the status region. |
| 2 | [`Persistence.razor`](./Persistence.razor)         | `localStorage` survival across reloads; `OnChange`. |
| 3 | [`CustomLabels.razor`](./CustomLabels.razor)       | `SizeLabels` for i18n / display names.          |
| 4 | [`CustomRendering.razor`](./CustomRendering.razor) | `RenderFragment<TextSizeChooserContext>` — custom button face (inline SVG, state-aware). |
| 5 | [`ExternalButtons.razor`](./ExternalButtons.razor) | Driving the control from your own UI via `SetSizeAsync` and a `@ref`. |

## Running the examples

These files are illustrations, not a build. The fastest way to try one
is:

1. Inside any Blazor Web App or Blazor Server project, drop the
   `.razor` file into your `Components/Pages/` directory.
2. Add the slug → font-size mapping from
   [`../docs/styling.md`](../docs/styling.md#mapping-slugs-to-typography)
   to your site stylesheet.
3. `dotnet run` and visit the `@page` route declared at the top of the
   file.

## Render modes

Every example declares `@rendermode InteractiveServer`. You can swap
this for `InteractiveWebAssembly` or `InteractiveAuto` depending on your
hosting model; the control's behaviour is identical in all three modes.

For a fully-static SSR-only page (no `@rendermode` directive), the
control renders its markup but cannot mutate the DOM —
`OnAfterRenderAsync` never fires, so no `data-text-size` is applied and
no stored value is read. Pair static SSR with a server-resolved cookie
strategy if you need the size to survive the first paint.

## What is deliberately missing

There is no `SystemPreference.razor` here, unlike the theme-chooser and
locale-chooser example sets. Browsers expose no "preferred text size"
signal — there is no media query equivalent to `prefers-color-scheme`
and no `navigator.languages` analogue — so the component ships no
`DetectFromSystem` parameter to demonstrate. Users who scale text at the
OS level are already served by browser zoom and the browser's own
minimum-font-size setting, which this helper must not fight.

## Two-way binding conventions

The control exposes its bindable on `Value`. Always use
`@bind-Value="size"` in markup, and pair with `OnChange` for one-shot
side effects.

## Naming

Blazor parameters are PascalCase: `Sizes`, `DefaultValue`, `SizeLabels`,
`StorageKey`. In `@code` blocks we use camelCase fields (`size`,
`picker`) per .NET conventions.

---

Lily™ and Lily Design System™ are trademarks.
