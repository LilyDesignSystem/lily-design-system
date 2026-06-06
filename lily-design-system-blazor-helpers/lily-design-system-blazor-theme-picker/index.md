# ThemePicker (Blazor helper)

A reusable, headless Blazor theme picker that **loads themes
dynamically at runtime** from a developer-specified directory.

The single source of truth is [spec.md](./spec.md). This file is the
comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Default theme](#default-theme)
- [Parameters](#parameters)
- [Events](#events)
- [Custom option rendering](#custom-option-rendering)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple pickers in one app](#multiple-pickers-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme pickers couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app (typically `wwwroot/assets/themes/`).
- **This component** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the picker via the
  `theme-picker` class hook.

The result is a small reusable widget that works in any Blazor 10
host (Server, WebAssembly, Web App with mixed render modes, static
SSR + interactivity) and against any theme catalog — Lily's 41
DaisyUI-inspired themes, NHS-aligned themes, or your own bespoke
set.

The component is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-picker`. APIs and behaviour match;
only the framework idioms differ.

## Install

Drop the folder into your Razor class library or app and add the
namespace import to your `_Imports.razor`:

```csharp
@using LilyDesignSystem.Blazor.Helpers
```

The only runtime dependency is
`Microsoft.AspNetCore.Components.Web` 10.0. There is no extra NuGet
package; the helper is two source files (`ThemePicker.razor` +
`ThemePicker.razor.cs`).

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `wwwroot/assets/themes/light.css`,
   `wwwroot/assets/themes/dark.css`. Each theme scopes its tokens
   to `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Render the picker, pointing it at the directory and listing the
   available slugs.

```razor
@using LilyDesignSystem.Blazor.Helpers

<ThemePicker
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new []{ "light", "dark", "abyss" })"
    @bind-Value="theme"
    StorageKey="lily-theme" />

@code {
    private string theme = "";
}
```

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- invokes `ValueChanged("dark")` (drives `@bind-Value`),
- invokes `OnChange("dark")` (one-shot side effect hook).

## How it works

On every theme change the picker performs four steps via a single
`IJSRuntime.InvokeVoidAsync("eval", …)` call:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-picker="{Name}">` in
   `document.head`.
2. **Swap the href** to `${ThemesUrl}${slug}${Extension}` so the new
   theme's CSS is fetched and applied. The previous theme's CSS is
   unloaded when the href changes.
3. **Set `data-theme="{slug}"`** on `document.documentElement`. Theme
   CSS files match this attribute via their `:root[data-theme="…"]`
   selector.
4. **Persist**: if `StorageKey` is set, write to `localStorage`
   (silently swallowing private-mode / quota errors).

All four steps are gated on `OnAfterRenderAsync(firstRender: true)`,
so static-SSR / prerender renders the markup with no DOM mutation.

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`Themes` list. The full resolution order on first interactive render
is:

1. `Value` parameter (if non-empty)
2. `localStorage[StorageKey]` (if `StorageKey` is set and readable)
3. `DefaultValue` parameter
4. `"light"` (if present in `Themes`)
5. `Themes[0]`
6. `""` — nothing is applied; the picker waits for user interaction

The picker never displays the word `"default"`. Option labels default
to the slug with its first letter upper-cased
(e.g. `"light"` → `"Light"`); override with `ThemeLabels`.

## Parameters

The complete table is in [spec.md §4.1](./spec.md#41-parameters). Highlights:

| Parameter      | Type                                  | Required | Notes                                      |
| -------------- | ------------------------------------- | -------- | ------------------------------------------ |
| `Label`        | `string`                              | yes      | `aria-label` on the radiogroup.            |
| `ThemesUrl`    | `string`                              | yes      | Trailing `/` is auto-added.                |
| `Themes`       | `IReadOnlyList<string>`               | yes      | Available slugs.                           |
| `Value`        | `string` (`@bind-Value`)              | no       | Two-way bind for the current slug.         |
| `DefaultValue` | `string?`                             | no       | Initial when nothing else applies.         |
| `StorageKey`   | `string?`                             | no       | `localStorage` persistence.                |
| `Name`         | `string`                              | no       | Radio `name`; defaults to `"theme"`.       |
| `Extension`    | `string`                              | no       | Defaults to `".css"`.                      |
| `ThemeLabels`  | `IReadOnlyDictionary<string,string>`  | no       | Per-slug display label override.           |
| `OnChange`     | `EventCallback<string>`               | no       | Callback fired after apply.                |
| `ChildContent` | `RenderFragment<ThemePickerContext>?` | no       | Custom rendering of the options.           |
| `CssClass`     | `string`                              | no       | Extra CSS class on the `<fieldset>` root.  |

See [docs/parameters-reference.md](./docs/parameters-reference.md)
for a field-by-field reference.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `ValueChanged`  | `string` | After selection, drives `@bind-Value`.                |
| `OnChange`      | `string` | After the picker applies a new theme (post-DOM-write). |

`ValueChanged` is the `@bind-Value` half; consumers usually only
wire `OnChange` for analytics, cookie writes, or imperative
side-effect coordination.

## Custom option rendering

Pass a `ChildContent` `RenderFragment<ThemePickerContext>` to take
full control of the option markup. The fragment receives a
`ThemePickerContext` with `{ Themes, Value, SetTheme, Name, LabelFor }`:

```razor
<ThemePicker
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new []{ "light", "dark", "abyss" })"
    @bind-Value="theme">

    <ChildContent Context="ctx">
        @foreach (var t in ctx.Themes)
        {
            <button type="button"
                    class="theme-picker-swatch"
                    data-theme="@t"
                    aria-pressed="@(ctx.Value == t)"
                    @onclick="@(() => ctx.SetTheme(t))">
                @ctx.LabelFor(t)
            </button>
        }
    </ChildContent>
</ThemePicker>
```

Working example: [`examples/CustomRendering.razor`](./examples/CustomRendering.razor).
Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `StorageKey` to persist the active slug to `localStorage`. On
a fresh interactive mount the picker reads back the stored slug as
part of the initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the picker
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/BlazorServerCookie/`](./examples/BlazorServerCookie/)
recipe.

## Accessibility

- The root is a `<fieldset>` with `role="radiogroup"` and
  `aria-label="@Label"`.
- Native `<input type="radio">` elements give Arrow / Space / Tab
  semantics for free; the picker does not override any keyboard
  behaviour.
- The active state is exposed in three independent channels:
  `aria-checked` on the radio, `data-theme` on the root, and the
  `Value` binding. No colour-only meaning is required.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The picker compiles cleanly under every Blazor 10 hosting model.
Under static SSR no `OnAfterRenderAsync` fires and no DOM is
touched; the markup renders using whatever `Value` (or empty
string) the consumer supplies.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `Value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/BlazorServerCookie/`](./examples/BlazorServerCookie/).

## Preloading for zero-flicker switching

By default the picker swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The picker still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/Preloaded.razor`](./examples/Preloaded.razor).

## Multiple pickers in one app

Pass a distinct `Name` parameter to each picker. The `Name` is used
as both the radio-input `name` (so the radios form separate groups)
and the discriminator on the managed `<link>` element
(`data-lily-theme-picker="{Name}"`).

Example: [`examples/MultiplePickers.razor`](./examples/MultiplePickers.razor).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Blazor Server before render.
- Migrating from a `localStorage`-only picker to a cookie-backed one.
- Building a flyout / dropdown UI around the picker.
- Loading themes from a CDN.
- Two-way binding patterns.

## Troubleshooting

See [`docs/troubleshooting.md`](./docs/troubleshooting.md). Common
pitfalls:

- **CSS does not switch.** Check that each theme file scopes its
  rules to `:root[data-theme="<slug>"]` (not `:root` alone).
- **404 on theme href.** Check the file is served from `ThemesUrl`
  and uses the configured `Extension` (defaults to `.css`).
- **Prerender mismatch.** Pass a server-resolved `Value` (cookie)
  so the SSR markup matches what the lifecycle hook will set on
  the client.
- **Theme does not persist.** Confirm `StorageKey` is set and that
  `localStorage` is available (not blocked by private mode).
- **`OnAfterRenderAsync` never fires.** The component is rendered
  with a static (non-interactive) render mode. Set
  `@rendermode="InteractiveServer"` (or `InteractiveAuto`) on the
  surrounding component.

## Testing

`dotnet test` against the bUnit suite exercises every numbered
acceptance criterion in
[spec.md §7](./spec.md#7-testing-acceptance-criteria).

## Files in this directory

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `spec.md`             | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`           | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`             | Topic-by-topic agent files.                      |
| `CLAUDE.md`           | `@AGENTS.md`.                                    |
| `ThemePicker.razor`   | Razor markup.                                    |
| `ThemePicker.razor.cs`| C# code-behind (partial class).                  |
| `ThemePickerTests.cs` | bUnit + xUnit spec covering every spec §7 item.  |
| `index.md`            | This file.                                       |
| `docs/`               | Deep-dive topic guides.                          |
| `examples/`           | Runnable `.razor` files.                         |
| `CHANGELOG.md`        | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
