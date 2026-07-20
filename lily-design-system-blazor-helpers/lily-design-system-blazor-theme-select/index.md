# ThemeSelect (Blazor helper)

A reusable, headless Blazor theme select that **loads themes
dynamically at runtime** from a developer-specified directory.

The control is an **icon button** (`◑`) that opens a **dropdown
listbox** of the available themes, built to the WAI-ARIA Authoring
Practices listbox pattern. It is not a native `<select>`.

The single source of truth is [spec/index.md](./spec/index.md). This file is the
comprehensive user guide. For topic deep-dives see
[docs/](./docs/) and for working code see [examples/](./examples/).

## Table of contents

- [Why this exists](#why-this-exists)
- [Install](#install)
- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [Rendered markup](#rendered-markup)
- [Keyboard](#keyboard)
- [Default theme](#default-theme)
- [Parameters](#parameters)
- [Events](#events)
- [Custom button content](#custom-button-content)
- [Persistence](#persistence)
- [Accessibility](#accessibility)
- [SSR and hydration](#ssr-and-hydration)
- [Preloading for zero-flicker switching](#preloading-for-zero-flicker-switching)
- [Multiple selects in one app](#multiple-selects-in-one-app)
- [Recipes](#recipes)
- [Troubleshooting](#troubleshooting)
- [Testing](#testing)

## Why this exists

Most theme selects couple selection, persistence, and styling into one
opinionated widget. This one splits the contract cleanly:

- **Authors** drop theme CSS files (e.g. `light.css`, `dark.css`) into
  a directory served by the app (typically `wwwroot/assets/themes/`).
- **This component** owns selection, dynamic loading, persistence, and
  accessibility.
- **Consumers** own the visual style of the select via the
  `theme-select` class hook.

The result is a small reusable widget that works in any Blazor 10
host (Server, WebAssembly, Web App with mixed render modes, static
SSR + interactivity) and against any theme catalog — Lily™'s 41
DaisyUI-inspired themes, NHS-aligned themes, or your own bespoke
set.

The component is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-select`. APIs and behaviour match;
only the framework idioms differ.

## Install

Drop the folder into your Razor class library or app and add the
namespace import to your `_Imports.razor`:

```csharp
@using LilyDesignSystem.Blazor.Helpers
```

The only runtime dependency is
`Microsoft.AspNetCore.Components.Web` 10.0. There is no extra NuGet
package; the helper is two source files (`ThemeSelect.razor` +
`ThemeSelect.razor.cs`).

## Quick start

1. Drop theme CSS files into a directory served by your app, e.g.
   `wwwroot/assets/themes/light.css`,
   `wwwroot/assets/themes/dark.css`. Each theme scopes its tokens
   to `:root[data-theme="<slug>"]` (the convention every Lily theme
   uses).
2. Render the select, pointing it at the directory and listing the
   available slugs.

```razor
@using LilyDesignSystem.Blazor.Helpers

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new []{ "light", "dark", "abyss" })"
    @bind-Value="theme"
    StorageKey="lily-theme" />

<p class="theme-select-status" aria-live="polite">
    Active theme: @ThemeLabel(theme)
</p>

@code {
    private string theme = "";

    private static string ThemeLabel(string slug) =>
        string.IsNullOrEmpty(slug)
            ? "none"
            : char.ToUpperInvariant(slug[0]) + slug[1..];
}
```

The status line is part of the pattern, not decoration. The closed
control is a bare glyph, so nothing on screen says which theme is
active; this line is the only place a sighted user reads the current
selection back without opening the listbox. `aria-live="polite"`
announces changes only, staying silent on first paint. Render it visible
by default; hide it with a visually-hidden class only if the design
truly cannot spare the space. Full rationale:
[docs/accessibility.md](./docs/accessibility.md#the-status-region-is-still-the-recommended-pattern).

When the user picks `dark`, the component:

- swaps a managed `<link rel="stylesheet">` in `<head>` to
  `/assets/themes/dark.css`,
- sets `data-theme="dark"` on `<html>`,
- writes `"dark"` to `localStorage["lily-theme"]`,
- invokes `ValueChanged("dark")` (drives `@bind-Value`),
- invokes `OnChange("dark")` (one-shot side effect hook).

## How it works

On every theme change the select performs four steps via a single
`IJSRuntime.InvokeVoidAsync("eval", …)` call:

1. **Locate or create** a managed
   `<link rel="stylesheet" data-lily-theme-select="{Name}">` in
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

## Rendered markup

```html
<div class="theme-select">
    <input type="hidden" name="theme" value="light" />
    <button type="button" class="theme-select-button"
            aria-label="Theme" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="theme-select-1-list">
        <span class="theme-select-icon" aria-hidden="true">&#9681;</span>
    </button>
    <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
        aria-label="Theme" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-1-option-0"
            role="option" aria-selected="true">Light</li>
        <li class="theme-select-option" id="theme-select-1-option-1"
            role="option" aria-selected="false">Dark</li>
    </ul>
</div>
```

- **The root `<div>`** carries the `theme-select` class hook plus your
  `CssClass`, and everything captured by `AdditionalAttributes` spreads
  onto it.
- **The hidden input** carries `Name` and `Value` so the control still
  participates in a form. The listbox itself is not a form control.
- **The glyph** is `◑` (U+25D1 CIRCLE WITH RIGHT HALF BLACK), wrapped in
  `aria-hidden="true"`. The accessible name therefore comes wholly from
  `Label` via the button's `aria-label` — never from the glyph. An empty
  `Label` leaves the control unnameable.
- **The listbox** carries `hidden` while closed and drops it while open;
  `aria-expanded` on the button tracks the same state. The sample above
  is the closed state. While open, `aria-activedescendant` on the `<ul>`
  points at the active option, which also carries `data-active` as a
  styling hook — both attributes are emitted only while open.
- List and option ids come from a monotonic process-wide counter
  (`theme-select-{n}`), so they are stable across re-render and safe
  under SSR.

The real selection lives in `Value`, which stays two-way bindable.

### The list needs positioning CSS

The package ships no CSS, so the open `<ul>` is an ordinary in-flow
element and will push the rest of your page down. Give the root
`position: relative` and the list `position: absolute` — the ready-made
block is in
[docs/styling.md](./docs/styling.md#the-list-needs-positioning-css--the-package-ships-none).

### Sizing the control

Because the closed control is an icon button, size it to the glyph
rather than to the widest theme name — and give it a floor so it stays a
clear target even if the platform substitutes or drops the character:

```css
.theme-select-button {
    min-inline-size: 2.25rem;
    min-block-size: 2.25rem;
}
```

See [docs/styling.md](./docs/styling.md) for the full hook list.

## Keyboard

The component implements the WAI-ARIA APG listbox pattern itself; none
of it comes free from the browser.

On the **button**:

| Key                 | Action                                                 |
| ------------------- | ------------------------------------------------------ |
| `Tab` / `Shift+Tab` | Move focus to / away from the button (one stop).       |
| `Arrow Down`        | Open, active option = the selected one (else index 0). |
| `Enter` / `Space`   | Open, active option = the selected one (else index 0). |
| `Arrow Up`          | Open with the **last** option active.                  |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key               | Action                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `Arrow Down`      | Move the active option down one; **clamps** at the last (no wrap).     |
| `Arrow Up`        | Move the active option up one; **clamps** at the first (no wrap).      |
| `Home`            | Jump to the first option.                                              |
| `End`             | Jump to the last option.                                               |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`          | Close and return focus **without** changing the value.                 |
| `Tab`             | Close **without** stealing focus back.                                 |
| Printable chars   | Typeahead over the option *labels*, 500 ms buffer reset.               |

Pointer and focus:

- Clicking an option selects it, applies it, and closes the listbox.
- Focus leaving the root closes the listbox without changing the value.

Two clauses deviate from the canonical Svelte implementation because of
Blazor's declarative event bindings — no `preventDefault` on keydown,
and `focusout` rather than a document click listener. Both are described
in [spec/index.md §6.4](./spec/index.md#64-framework-deviations) and
[docs/accessibility.md](./docs/accessibility.md#blazor-specific-deviations).

## Default theme

The default theme is `"light"` whenever `"light"` appears in your
`Themes` list. The full resolution order on first interactive render
is:

1. `Value` parameter (if non-empty)
2. `localStorage[StorageKey]` (if `StorageKey` is set and readable)
3. `prefers-color-scheme` (only when `DetectFromSystem` is true)
4. `DefaultValue` parameter
5. `"light"` (if present in `Themes`)
6. `Themes[0]`
7. `""` — nothing is applied; the select waits for user interaction

The select never displays the word `"default"`. Option labels default
to each hyphen-separated word of the slug, title-cased
(e.g. `"light"` → `"Light"`); override with `ThemeLabels`.

## Parameters

The complete table is in [spec/index.md §4.1](./spec/index.md#41-parameters). Highlights:

| Parameter      | Type                                  | Required | Notes                                      |
| -------------- | ------------------------------------- | -------- | ------------------------------------------ |
| `Label`        | `string`                              | yes      | `aria-label` on the button AND the listbox. The button is icon-only, so this is its entire accessible name. |
| `ThemesUrl`    | `string`                              | yes      | Trailing `/` is auto-added.                |
| `Themes`       | `IReadOnlyList<string>`               | yes      | Available slugs.                           |
| `Value`        | `string` (`@bind-Value`)              | no       | Two-way bind for the current slug.         |
| `DefaultValue` | `string?`                             | no       | Initial when nothing else applies.         |
| `StorageKey`   | `string?`                             | no       | `localStorage` persistence.                |
| `DetectFromSystem` | `bool`                            | no       | Follow OS `prefers-color-scheme` on first visit; off by default. |
| `Name`         | `string`                              | no       | `name` on the hidden input AND the `data-lily-theme-select` discriminator on the managed `<link>`; defaults to `"theme"`. |
| `Extension`    | `string`                              | no       | Defaults to `".css"`.                      |
| `ThemeLabels`  | `IReadOnlyDictionary<string,string>`  | no       | Per-slug display label override.           |
| `OnChange`     | `EventCallback<string>`               | no       | Callback fired after apply.                |
| `ChildContent` | `RenderFragment<ThemeSelectContext>?` | no       | Replaces the glyph inside the button. It does not render options. |
| `CssClass`     | `string`                              | no       | Extra CSS class merged into the root `<div>`. |
| `AdditionalAttributes` | `Dictionary<string,object>?`  | no       | Unmatched attributes; spread onto the root `<div>`. |

There is **no `Placeholder` parameter**. It existed only to pin a native
`<select>`'s closed display, and there is no `<select>` any more.

See [docs/parameters-reference.md](./docs/parameters-reference.md)
for a field-by-field reference.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `ValueChanged`  | `string` | After selection, drives `@bind-Value`.                |
| `OnChange`      | `string` | After the select applies a new theme (post-DOM-write). |

`ValueChanged` is the `@bind-Value` half; consumers usually only
wire `OnChange` for analytics, cookie writes, or imperative
side-effect coordination.

## Custom button content

Pass a `ChildContent` `RenderFragment<ThemeSelectContext>` to replace
the default glyph **inside the button**. It does not render the options
— the listbox is owned by the component. The fragment receives a
`ThemeSelectContext` with `{ Value, Open, LabelFor }`:

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new []{ "light", "dark", "abyss" })"
    @bind-Value="theme">

    <ChildContent Context="ctx">
        @* An inline SVG is the robust alternative to the font glyph. *@
        <svg class="theme-select-glyph" aria-hidden="true"
             width="18" height="18" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" />
            <path d="M10 1a9 9 0 0 1 0 18Z" fill="currentColor" />
        </svg>
    </ChildContent>
</ThemeSelect>
```

Keep the replacement `aria-hidden="true"`: the button's accessible name
still comes from `Label`, and visible text inside the button would
compete with it. `Open` lets the face react to the listbox state, and
`LabelFor` resolves a slug to its display label — so a text-plus-glyph
button face is also possible:

```razor
<ChildContent Context="ctx">
    <span aria-hidden="true">@ctx.LabelFor(ctx.Value) @(ctx.Open ? "▴" : "▾")</span>
</ChildContent>
```

To drive selection imperatively — from your own swatch grid, a keyboard
shortcut, or an OS colour-scheme listener — call `SetThemeAsync(string)`
on a `@ref` to the component. The old `ctx.SetTheme` callback is gone
along with the option-rendering role:

```razor
<ThemeSelect @ref="select" Label="Theme" ... />
<button type="button" @onclick="@(() => select!.SetThemeAsync("dark"))">Dark</button>

@code {
    private ThemeSelect? select;
}
```

Topic guide: [`docs/custom-rendering.md`](./docs/custom-rendering.md).

## Persistence

Pass a `StorageKey` to persist the active slug to `localStorage`. On
a fresh interactive mount the select reads back the stored slug as
part of the initial-value resolution (§ Default theme).

Errors writing to or reading from `localStorage` (private mode,
quota, disabled storage) are silently swallowed — the select
continues to work in-memory.

If you need cookie-based persistence (so SSR can read the theme
before first paint), see [`docs/ssr.md`](./docs/ssr.md) and the
[`examples/BlazorServerCookie/`](./examples/BlazorServerCookie/)
recipe.

## Accessibility

- The trigger is a `<button type="button">` with `aria-label="@Label"`,
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
  pointing at the list.
- The popup is a `<ul role="listbox" tabindex="-1">` of
  `<li role="option" aria-selected>`. Focus stays on the `<ul>` while
  open; the active option is conveyed by `aria-activedescendant`, per
  the APG listbox pattern.
- Arrow / `Home` / `End` / typeahead semantics are implemented by the
  component (see [Keyboard](#keyboard)); none of them come free from
  the browser.
- The active state is exposed in three independent channels:
  `data-theme` on the document root, the `Value` binding (mirrored onto
  the hidden input), and `aria-selected` on exactly one option. No
  colour-only meaning is required.
- **Tradeoff 1:** the button is icon-only and the glyph is
  `aria-hidden`, so the accessible name rests entirely on `Label`. An
  empty or untranslated `Label` leaves the control unnameable.
- **Tradeoff 2:** a custom listbox has weaker assistive-technology
  support than a native `<select>`, which the platform renders with its
  own picker — behaviour varies more, especially on mobile screen
  readers and in virtual/browse modes.
- **Tradeoff 3:** the glyph is a font character (U+25D1), not a shipped
  asset, so it may render at an unexpected weight, be substituted, or
  be missing entirely. Supply your own `ChildContent` and a
  `min-inline-size` if that matters.
- WCAG 2.2 AAA is the target; visible focus styling is the
  consumer's CSS responsibility — including a `[data-active]` cue on
  the active option, which is never focused.

Topic guide: [`docs/accessibility.md`](./docs/accessibility.md).

## SSR and hydration

The select compiles cleanly under every Blazor 10 hosting model.
Under static SSR no `OnAfterRenderAsync` fires and no DOM is
touched; the markup renders using whatever `Value` (or empty
string) the consumer supplies.

For zero-flicker SSR, resolve the theme on the server (e.g. from a
cookie) and pass it as `Value`. See
[`docs/ssr.md`](./docs/ssr.md) and
[`examples/BlazorServerCookie/`](./examples/BlazorServerCookie/).

## Preloading for zero-flicker switching

By default the select swaps one `<link>` href, so the active theme
is fetched on demand. To switch instantly between themes, preload
them all yourself:

```html
<link rel="stylesheet" href="/assets/themes/light.css">
<link rel="stylesheet" href="/assets/themes/dark.css">
<link rel="stylesheet" href="/assets/themes/abyss.css">
```

The select still mutates `data-theme`, and since every theme's CSS
is scoped to `:root[data-theme="…"]`, the active rules switch
instantly with the attribute change — no network round-trip.

Topic guide: [`docs/preloading.md`](./docs/preloading.md). Working
example: [`examples/Preloaded.razor`](./examples/Preloaded.razor).

## Multiple selects in one app

Pass a distinct `Name` parameter to each select. The `Name` is used
as both the hidden input's `name` (so the selects stay independent in
a form) and the discriminator on the managed `<link>` element
(`data-lily-theme-select="{Name}"`).

Example: [`examples/MultipleSelects.razor`](./examples/MultipleSelects.razor).

## Recipes

Quick cookbook in [`docs/recipes.md`](./docs/recipes.md):

- Following the OS colour scheme via `prefers-color-scheme`.
- Reading a theme cookie in Blazor Server before render.
- Migrating from a `localStorage`-only select to a cookie-backed one.
- Building a flyout / dropdown UI around the select.
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
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria).

## Files in this directory

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `spec/index.md`             | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`           | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`             | Topic-by-topic agent files.                      |
| `CLAUDE.md`           | `@AGENTS.md`.                                    |
| `ThemeSelect.razor`   | Razor markup.                                    |
| `ThemeSelect.razor.cs`| C# code-behind (partial class).                  |
| `ThemeSelectTests.cs` | bUnit + xUnit spec covering every spec §7 item.  |
| `index.md`            | This file.                                       |
| `docs/`               | Deep-dive topic guides.                          |
| `examples/`           | Runnable `.razor` files.                         |
| `CHANGELOG.md`        | Version history.                                 |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
