# Parameters reference

Field-by-field reference for every public parameter. The contract is
owned by [`../spec.md`](../spec.md) §4; this file expands the
rationale and common usage.

## `Label` — required, `string`

`aria-label` on the `<select>`. Always supplied, always
translatable. Screen readers announce it as the control's name.

```razor
<ThemeSelect Label="Theme" ... />
```

In an i18n setup with `IStringLocalizer<T>`:

```razor
<ThemeSelect Label="@Localizer["chooseTheme"]" ... />
```

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
<ThemeSelect @bind-Value="theme" ... />

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
<ThemeSelect DefaultValue="dark" ... />
```

## `StorageKey` — optional, `string?`

`localStorage` key for persistence. When set, the select:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

```razor
<ThemeSelect StorageKey="lily-theme" ... />
```

## `Name` — optional, `string` — defaults to `"theme"`

The `name` attribute on the `<select>`. It also serves as the
discriminator on the managed `<link>` element
(`data-lily-theme-select="{Name}"`), so multiple selects can
coexist by giving each a distinct `Name`.

```razor
<ThemeSelect Name="appearance" ... />
```

## `Extension` — optional, `string` — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

```razor
<ThemeSelect Extension=".css?v=2026-06-05" ... />
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
<ThemeSelect OnChange="OnThemeChange" ... />

@code {
    private async Task OnThemeChange(string slug)
    {
        await Http.PostAsJsonAsync("/api/theme", new { theme = slug });
    }
}
```

## `ChildContent` — optional, `RenderFragment<ThemeSelectContext>?`

Custom rendering of the options. The fragment receives a
`ThemeSelectContext`. See
[custom-rendering.md](./custom-rendering.md) for patterns.

```razor
<ThemeSelect ...>
    <ChildContent Context="ctx">
        @* custom markup using ctx.Themes, ctx.SetTheme, ... *@
    </ChildContent>
</ThemeSelect>
```

## `CssClass` — optional, `string`

Extra CSS class hook on the `<select>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

```razor
<ThemeSelect CssClass="my-theme-select" ... />
```

The root element ends up as
`<select class="theme-select my-theme-select" …>`.

## `AdditionalAttributes` — optional, `Dictionary<string, object>?`

Captured by `[Parameter(CaptureUnmatchedValues = true)]`. Any
attribute not explicitly bound to a parameter falls through to the
root `<select>`. Use this to attach test IDs, analytics handlers,
and overrides without forking the component:

```razor
<ThemeSelect
    Label="Theme"
    ThemesUrl="/t/"
    Themes="@(new[] { "light" })"
    data-testid="theme-select"
    id="appearance-select" />
```

Both `data-testid` and `id` land on the `<select>`.

## Render fragment context

`ThemeSelectContext`:

```csharp
public sealed class ThemeSelectContext
{
    public required IReadOnlyList<string> Themes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetTheme { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

See [custom-rendering.md](./custom-rendering.md) for usage.

## Two-way binding cheat sheet

```razor
<!-- One-way (Value only) — read but not write -->
<ThemeSelect Value="@theme" ... />

<!-- Two-way bind — read and write -->
<ThemeSelect @bind-Value="theme" ... />

<!-- Two-way bind + side-effect callback -->
<ThemeSelect @bind-Value="theme" OnChange="OnChange" ... />

<!-- Two-way bind + explicit ValueChanged (rarely needed) -->
<ThemeSelect Value="@theme" ValueChanged="@(v => theme = v)" ... />
```
