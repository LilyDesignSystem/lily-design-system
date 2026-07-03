# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

The select has no opinion about light vs dark; resolve the media
query in `OnAfterRenderAsync` and pass it as `DefaultValue`:

```razor
@inject IJSRuntime JS

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })"
    DefaultValue="@osPreference"
    StorageKey="my-app:theme" />

@code {
    private string? osPreference;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        var dark = await JS.InvokeAsync<bool>(
            "eval",
            "window.matchMedia?.('(prefers-color-scheme: dark)').matches === true");
        osPreference = dark ? "dark" : "light";
        StateHasChanged();
    }
}
```

The user's explicit choice (via `StorageKey`) wins on later visits.

## Track OS colour scheme changes live

```razor
@inject IJSRuntime JS

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })"
    @bind-Value="theme" />

@code {
    private string theme = "";

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        var dotNetRef = DotNetObjectReference.Create(this);
        await JS.InvokeVoidAsync("eval", @"
            (function(ref) {
                var mql = window.matchMedia('(prefers-color-scheme: dark)');
                mql.addEventListener('change', function(e) {
                    ref.invokeMethodAsync('OnSchemeChange', e.matches);
                });
            })(arguments[0])
        ", dotNetRef);
    }

    [JSInvokable]
    public Task OnSchemeChange(bool dark)
    {
        theme = dark ? "dark" : "light";
        StateHasChanged();
        return Task.CompletedTask;
    }
}
```

## Read a theme cookie before render (Blazor Web App)

See [`../examples/BlazorServerCookie/`](../examples/BlazorServerCookie/)
for the full recipe.

## Migrate from a localStorage-only select to a cookie-backed one

1. Keep `StorageKey` for now so existing users don't lose their
   preference.
2. In the `OnChange` handler, also POST to a server endpoint that
   writes the cookie:
   ```razor
   <ThemeSelect
       ...
       StorageKey="lily-theme"
       OnChange="OnThemeChange" />
   ```
   ```csharp
   private async Task OnThemeChange(string slug)
   {
       await Http.PostAsJsonAsync("/api/theme", new { theme = slug });
   }
   ```
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `Value` (which short-circuits the
   storage read).

## Build a flyout / dropdown UI

Use [custom-rendering](./custom-rendering.md) to swap the option
list for a button-triggered popover. Keep the select's `aria-label`
on the flyout *trigger* so screen readers still hear the control
label.

## Serve themes from a CDN

```razor
<ThemeSelect
    ThemesUrl="https://cdn.example.com/lily-themes/"
    Themes="@(new[] { "light", "dark", "abyss" })"
    Label="Theme" />
```

The CDN must allow cross-origin stylesheet loading (a stylesheet
served from a different origin does not need CORS, but a `<link
crossorigin="…">` attribute is needed if you also need
`document.styleSheets[].cssRules` access from the same origin).

## Cache-bust a theme

```razor
<ThemeSelect
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })"
    Extension=".css?v=2026-06-05"
    Label="Theme" />
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

Each select gets a distinct `Name` (so the `<select>` controls and
managed `<link>`s don't collide). Targets other than `<html>` aren't supported
out of the box (the helper writes to `document.documentElement`); for
per-region scoping use a wrapping `data-theme="…"` attribute that
your CSS selectors target, applied via a custom `OnChange` handler.

See [`../examples/MultipleSelects.razor`](../examples/MultipleSelects.razor).

## Programmatically switch themes from a sibling component

The bindable `Value` is the simplest channel. Hoist `theme` to a
shared `CascadingValue` or to a singleton service injected via DI,
and write to it from anywhere:

```csharp
public class ThemeState
{
    private string _theme = "light";
    public event Action? OnChange;
    public string Theme { get => _theme; set { _theme = value; OnChange?.Invoke(); } }
}
```

```razor
@inject ThemeState State

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })"
    Value="@State.Theme"
    OnChange="@(slug => State.Theme = slug)" />
```

The select reacts via its `Value` parameter on the next render.

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs. Wire it
up via `IJSRuntime`:

```razor
@inject IJSRuntime JS

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark" })"
    @bind-Value="theme"
    StorageKey="my-app:theme" />

@code {
    private string theme = "";

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        var dotNetRef = DotNetObjectReference.Create(this);
        await JS.InvokeVoidAsync("eval", @"
            (function(ref) {
                window.addEventListener('storage', function(e) {
                    if (e.key === 'my-app:theme' && e.newValue) {
                        ref.invokeMethodAsync('OnExternalThemeChange', e.newValue);
                    }
                });
            })(arguments[0])
        ", dotNetRef);
    }

    [JSInvokable]
    public Task OnExternalThemeChange(string newTheme)
    {
        theme = newTheme;
        StateHasChanged();
        return Task.CompletedTask;
    }
}
```

## Switch theme on culture change

Wire `LocaleSelect`'s `OnChange` to set both `CultureInfo` and pick
a theme appropriate to the locale (e.g. brand colours per locale):

```razor
<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale"
    OnChange="OnLocaleChange" />

<ThemeSelect
    Label="Theme"
    ThemesUrl="/assets/themes/"
    Themes="@(new[] { "light", "dark", "high-contrast" })"
    @bind-Value="theme" />

@code {
    private string locale = "en";
    private string theme = "light";

    private void OnLocaleChange(string code)
    {
        theme = code switch
        {
            "ar" => "rtl-friendly-theme",
            _    => "light",
        };
    }
}
```

The two selects compose without conflict because they own different
DOM signals (`data-theme` vs `lang` + `dir`).
