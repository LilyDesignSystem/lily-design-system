# Parameters reference

Field-by-field reference for every public parameter. The contract is
owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `Label` — required, `string`

`aria-label` on **both** the button and the `<ul role="listbox">`.
Always supplied, always translatable. Screen readers announce it as the
control's name.

```razor
<ThemeChooser Label="Theme" ... />
```

In an i18n setup with `IStringLocalizer<T>`:

```razor
<ThemeChooser Label="@Localizer["chooseTheme"]" ... />
```

This one carries more weight than a typical label. The button renders
only a glyph, and the glyph is `aria-hidden="true"` — so `Label` is the
control's *entire* accessible name, with no visible-text fallback. An
empty or untranslated `Label` leaves the control announcing as a bare
"button". See [`accessibility.md`](accessibility.md#1-the-accessible-name-rests-entirely-on-aria-label).

## `Placeholder` — **removed**

There is no `Placeholder` parameter. It existed only to pin a native
`<select>`'s closed display to a short word; there is no `<select>` any
more. Passing it is a compile error.

The closed control now shows a glyph, so if you want the active theme
visible, render a status region next to the control — see
[`accessibility.md`](accessibility.md#the-status-region-is-still-the-recommended-pattern)
and the `.theme-chooser-status` hook in
[`styling.md`](styling.md#the-status-region).

## `ThemesUrl` — required, `string`

Base URL of the directory the theme CSS files are served from. A
trailing `/` is appended automatically if missing, so both
`"/assets/themes/"` and `"/assets/themes"` work.

Acceptable values:

- Absolute path: `"/assets/themes/"` — recommended for in-app
  assets.
- Absolute URL: `"https://cdn.example.com/themes/"` — for
  CDN-hosted themes (CORS-permitting).
- Relative path: `"./themes/"` — works but depends on the current
  document base URL; not recommended for production.

For a Blazor app, themes typically live under
`wwwroot/assets/themes/` and the URL is `/assets/themes/`.

## `Themes` — required, `IReadOnlyList<string>`

The slugs of the themes the select exposes as options. The slug is
used both as the `<option>` `value` and as the URL path segment when
constructing the stylesheet href. Choose slugs that are safe URL
path segments — kebab-case ASCII is recommended.

```razor
Themes="@(new[] { "light", "dark", "abyss" })"
```

## `Value` — optional, `string` (`@bind-Value`)

The active slug. Two-way bindable with `@bind-Value` so the
surrounding code can read and write the selection.

When supplied as a non-empty string, the select treats it as the
authoritative initial value — `StorageKey` and `DefaultValue` are
both skipped on first interactive render.

```razor
<ThemeChooser @bind-Value="theme" ... />

@code { private string theme = ""; }
```

## `ValueChanged` — optional, `EventCallback<string>`

The other half of `@bind-Value`. You almost never set this
directly; Blazor's `@bind-Value` syntax desugars to
`Value=` + `ValueChanged=`.

## `DefaultValue` — optional, `string?`

Used during initial-value resolution when `Value` is empty and
nothing was stored. If `DefaultValue` is itself empty / null, the
resolver falls back to `"light"` (when present in `Themes`) and
then to `Themes[0]`.

```razor
<ThemeChooser DefaultValue="dark" ... />
```

## `StorageKey` — optional, `string?`

`localStorage` key for persistence. When set, the select:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

```razor
<ThemeChooser StorageKey="lily-theme" ... />
```

## `DetectFromSystem` — optional, `bool` — defaults to `false`

Opt in to resolving the OS colour scheme on first visit. The component
probes `matchMedia("(prefers-color-scheme: dark)")` once, during initial
value resolution, and maps the answer onto a supported slug via the
public `ThemeChooser.MatchSystemTheme` helper.

Detection sits in the middle of the resolution order:

```
Value > StorageKey > DetectFromSystem > DefaultValue > "light" > Themes[0]
```

so a returning visitor's stored choice always beats the OS preference —
detection only ever decides the first visit.

```razor
<ThemeChooser DetectFromSystem="true" StorageKey="lily-theme" ... />
```

If the OS prefers a scheme this control does not offer (`dark` with no
`"dark"` slug in `Themes`), detection yields nothing and resolution
falls through to `DefaultValue`.

Detection resolves **once**, on first render. It does not subscribe to
the media query, so it will not re-theme a page when the user flips
their OS while the tab is open — that would fight a selection the user
made by hand. To follow OS changes live, add your own listener and call
`SetThemeAsync`; see
[recipes.md](recipes.md#track-os-colour-scheme-changes-live).

The counterpart on LocaleChooser is `DetectFromNavigator`, which reads
`navigator.languages` in the same slot.

## `Name` — optional, `string` — defaults to `"theme"`

The `name` attribute on the hidden input that carries `Value` for form
participation. It also serves as the
discriminator on the managed `<link>` element
(`data-lily-theme-chooser="{Name}"`), so multiple selects can
coexist by giving each a distinct `Name`.

```razor
<ThemeChooser Name="appearance" ... />
```

## `Extension` — optional, `string` — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

```razor
<ThemeChooser Extension=".css?v=2026-06-05" ... />
```

## `ThemeLabels` — optional, `IReadOnlyDictionary<string, string>`

Per-slug display label override. When unset, default labels
title-case the slug: `"light"` → `"Light"`, `"abyss"` → `"Abyss"`.
Use `ThemeLabels` for i18n or for slugs that don't gracefully
title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

```razor
ThemeLabels="@(new Dictionary<string, string>
{
    ["light"] = "Bright",
    ["dark"]  = "Midnight",
})"
```

## `OnChange` — optional, `EventCallback<string>`

Fires every time the select successfully applies a theme. Use it
for analytics, server cookie writes, or notifying a sibling
component.

```razor
<ThemeChooser OnChange="OnThemeChange" ... />

@code {
    private async Task OnThemeChange(string slug)
    {
        await Http.PostAsJsonAsync("/api/theme", new { theme = slug });
    }
}
```

## `ChildContent` — optional, `RenderFragment<ThemeChooserContext>?`

**Replaces the glyph inside the button.** It does *not* render the
options — those are always component-owned, so the listbox semantics
cannot be broken by a consumer override. The fragment receives a
`ThemeChooserContext`. See
[custom-rendering.md](./custom-rendering.md) for patterns.

```razor
<ThemeChooser ...>
    <ChildContent Context="ctx">
        <svg class="my-icon" aria-hidden="true" ...>...</svg>
    </ChildContent>
</ThemeChooser>
```

Supplying `ChildContent` removes the default `.theme-chooser-icon`
span. Keep whatever you render `aria-hidden="true"` — the accessible
name must keep coming from the button's `aria-label` (i.e. `Label`).

## `CssClass` — optional, `string`

Extra CSS class hook on the root `<div>`. Always emitted after
`"theme-chooser"`, so consumer styles can use either selector.

```razor
<ThemeChooser CssClass="my-theme-chooser" ... />
```

The root element ends up as
`<div class="theme-chooser my-theme-chooser" …>`.

## `AdditionalAttributes` — optional, `Dictionary<string, object>?`

Captured by `[Parameter(CaptureUnmatchedValues = true)]`. Any
attribute not explicitly bound to a parameter falls through to the
root `<div>`. Use this to attach test IDs, analytics handlers,
and overrides without forking the component:

```razor
<ThemeChooser
    Label="Theme"
    ThemesUrl="/t/"
    Themes="@(new[] { "light" })"
    data-testid="theme-chooser"
    id="appearance-select" />
```

Both `data-testid` and `id` land on the root `<div>` — not on the
button. To target the button, use the `.theme-chooser-button` class hook
or a descendant selector.

## Static helpers

Pure and side-effect free, so they are usable without rendering the
component at all:

| Member | Purpose |
| ------ | ------- |
| `NormaliseThemesUrl(string)` | Ensure the themes URL ends with exactly one `/`. |
| `ThemeHref(themesUrl, slug, extension)` | Construct a theme stylesheet href. |
| `ThemeName(string)` | Slug → title-cased display label. |
| `MatchSystemTheme(bool?, IReadOnlyList<string>)` | OS colour-scheme preference → supported slug, or `""`. |

### `ThemeName(string slug)`

The single public implementation of the default label rule — each
hyphen-separated word title-cased:

```csharp
ThemeChooser.ThemeName("high-contrast");   // "High Contrast"
ThemeChooser.ThemeName("light");           // "Light"
```

The component's own option labels come from this exact function (after
checking `ThemeLabels`), so an external control driving the select via
`SetThemeAsync` renders identical labels without duplicating the rule.
Before it was public, every example in the catalog hand-rolled its own
copy of the title-casing.

It mirrors `Locales.LocaleName` on LocaleChooser.

### `MatchSystemTheme(bool? prefersDark, IReadOnlyList<string> themes)`

The pure decision behind `DetectFromSystem`. The browser reading happens
in the component's interop probe; this function is the separately
testable mapping:

```csharp
ThemeChooser.MatchSystemTheme(true,  new[] { "light", "dark" });  // "dark"
ThemeChooser.MatchSystemTheme(false, new[] { "light", "dark" });  // "light"
ThemeChooser.MatchSystemTheme(true,  new[] { "light", "sepia" }); // ""  (unsupported)
ThemeChooser.MatchSystemTheme(null,  new[] { "light", "dark" });  // ""  (matchMedia absent)
```

`prefersDark` is the result of
`matchMedia("(prefers-color-scheme: dark)").matches`, or `null` when
`matchMedia` is unavailable — prerender, static SSR, or a host without
the API. **Null always yields `""`**, which is what keeps detection
SSR-safe.

It mirrors `Locales.MatchNavigatorLanguage` on LocaleChooser, which takes
the navigator list the same way.

## Render fragment context

`ThemeChooserContext` — mirrors the canonical Svelte `ChildArgs`:

```csharp
public sealed class ThemeChooserContext
{
    /// Currently selected theme slug.
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a slug to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

The old `Themes`, `SetTheme` and `Name` members are gone: the fragment
no longer renders options, so it no longer needs them. To drive the
control imperatively from your own UI, call the public
`SetThemeAsync(string slug)` method on a `@ref` to the component
instead.

See [custom-rendering.md](./custom-rendering.md) for usage.

## Two-way binding cheat sheet

```razor
<!-- One-way (Value only) — read but not write -->
<ThemeChooser Value="@theme" ... />

<!-- Two-way bind — read and write -->
<ThemeChooser @bind-Value="theme" ... />

<!-- Two-way bind + side-effect callback -->
<ThemeChooser @bind-Value="theme" OnChange="OnChange" ... />

<!-- Two-way bind + explicit ValueChanged (rarely needed) -->
<ThemeChooser Value="@theme" ValueChanged="@(v => theme = v)" ... />
```

---

Lily™ and Lily Design System™ are trademarks.
