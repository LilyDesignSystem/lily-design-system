# LocalePicker (Blazor helper)

A reusable, headless Blazor locale picker that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection.

For the full contract see [spec.md](./spec.md) — it is the single
source of truth for the API, behaviour, and tests. For topic
deep-dives see [docs/](./docs/) and for working code see
[examples/](./examples/).

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Examples](#examples)
- [Built-in locale data](#built-in-locale-data)
- [Parameters](#parameters)
- [Events](#events)
- [Accessibility](#accessibility)
- [SSR](#ssr)
- [Files in this directory](#files-in-this-directory)
- [Documentation](#documentation)
- [Examples directory](#examples-directory)

## Install

Drop the folder into your Razor class library or app and add the
namespace import to your `_Imports.razor`:

```csharp
@using LilyDesignSystem.Blazor.Helpers
```

The only runtime dependency is
`Microsoft.AspNetCore.Components.Web` 10.0. There is no extra NuGet
package; the helper is four source files (`LocalePicker.razor` +
`LocalePicker.razor.cs` + `Locales.cs` + `locales.tsv`).

## Quick start

Render the picker with a `Label` and the list of locales your app
supports. The picker writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive
technology all see the change.

```razor
@using LilyDesignSystem.Blazor.Helpers

<LocalePicker
    Label="Language"
    Locales="@(new []{ "en", "en_US", "fr", "fr_CA", "ar", "he" })"
    @bind-Value="locale"
    StorageKey="lily-locale"
    DetectFromNavigator="true" />

@code {
    private string locale = "";
}
```

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `ValueChanged("ar")` (drives `@bind-Value`),
- fires `OnChange("ar")` (one-shot side effect hook).

The picker does NOT translate strings — that is the consumer's i18n
library (e.g. `Microsoft.Extensions.Localization`,
`IStringLocalizer<T>`, custom `CultureInfo` switching). Wire the
bindable `Value` or `OnChange` to your library so it loads the
right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry
locale identifiers with underscores (`en_US`, `zh_Hant_TW`). The
picker accepts whichever form you prefer in the `Locales` list and
converts to the hyphen form when writing to the DOM. The bindable
`Value` preserves your original form, so round-trips are lossless.

```csharp
Locales.Bcp47LocaleTag("en_US");      // "en-US"
Locales.Bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
Locales.Bcp47LocaleTag("en");         // "en"
```

References:

- W3C — [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)
- IETF — [RFC 5646 (BCP 47), Tags for Identifying Languages](https://www.rfc-editor.org/rfc/rfc5646)
- IANA — [Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry)

## RTL auto-detection

`Locales.IsRtlLocale(locale)` returns `true` for any locale whose
base language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`,
`ji`, `ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose
script subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`,
`Mong`, `Adlm`.

```csharp
Locales.IsRtlLocale("ar");         // true
Locales.IsRtlLocale("he_IL");      // true
Locales.IsRtlLocale("uz_Arab_AF"); // true (script subtag)
Locales.IsRtlLocale("en");         // false
```

Pass `ApplyDir="false"` if you want full control of `dir` yourself.

## Examples

### Default radio group

```razor
<LocalePicker
    Label="Language"
    Locales="@(new[] { "en", "cy" })"
    @bind-Value="locale" />
```

Renders:

```html
<fieldset class="locale-picker" role="radiogroup" aria-label="Language">
    <label class="locale-picker-option" lang="en">
        <input type="radio" name="locale" value="en" checked />
        <span class="locale-picker-option-label">English</span>
    </label>
    <label class="locale-picker-option" lang="cy">
        <input type="radio" name="locale" value="cy" />
        <span class="locale-picker-option-label">Welsh</span>
    </label>
</fieldset>
```

Each option carries `lang` so screen readers pronounce option text
in the correct language (WCAG 3.1.2, Language of Parts).

### Pretty labels for option text

By default the picker uses the English names from `locales.tsv`
(and falls back to the raw code). Override per-code with
`LocaleLabels`:

```razor
<LocalePicker
    Label="Langue"
    Locales="@(new[] { "en", "fr", "ar" })"
    LocaleLabels="@(new Dictionary<string, string>
    {
        ["en"] = "English",
        ["fr"] = "Français",
        ["ar"] = "العربية",
    })"
    @bind-Value="locale" />
```

### Driving a `<select>` instead of radios

Use the `ChildContent` `RenderFragment<LocalePickerContext>` for
full markup control. The picker still owns the apply lifecycle:

```razor
<LocalePicker
    Label="Language"
    Locales="@(new[] { "en", "fr", "es", "de", "ar" })"
    @bind-Value="locale"
    StorageKey="lily-locale">
    <ChildContent Context="ctx">
        <select aria-label="Language"
                value="@ctx.Value"
                @onchange="@(async e => await ctx.SetLocale(e.Value?.ToString() ?? ""))">
            @foreach (var l in ctx.Locales)
            {
                <option value="@l" lang="@ctx.TagFor(l)">@ctx.LabelFor(l)</option>
            }
        </select>
    </ChildContent>
</LocalePicker>
```

### Driving a button group

```razor
<LocalePicker
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale">
    <ChildContent Context="ctx">
        <ul class="locale-picker-list" role="list">
            @foreach (var l in ctx.Locales)
            {
                <li>
                    <button type="button"
                            aria-pressed="@(ctx.Value == l)"
                            lang="@ctx.TagFor(l)"
                            dir="@(ctx.IsRtl(l) ? "rtl" : "ltr")"
                            @onclick="@(async () => await ctx.SetLocale(l))">
                        @ctx.LabelFor(l)
                    </button>
                </li>
            }
        </ul>
    </ChildContent>
</LocalePicker>
```

### Wiring `IStringLocalizer<T>`

```razor
@inject IStringLocalizer<SharedResources> Localizer

<LocalePicker
    Label="@Localizer["chooseLanguage"]"
    Locales="@(new[] { "en", "fr", "ar" })"
    @bind-Value="locale"
    DetectFromNavigator="true"
    StorageKey="app-locale"
    OnChange="OnLocaleChange" />

@code {
    private string locale = "";

    private void OnLocaleChange(string code)
    {
        var ci = new CultureInfo(Locales.Bcp47LocaleTag(code));
        CultureInfo.DefaultThreadCurrentCulture = ci;
        CultureInfo.DefaultThreadCurrentUICulture = ci;
    }
}
```

### Server-resolved initial value (SSR)

For flicker-free first paint, resolve the locale on the server
(from a cookie or `Accept-Language`) and pass it as `Value`:

```razor
@inject IHttpContextAccessor HttpContextAccessor

@{
    var cookieLocale = HttpContextAccessor.HttpContext?
        .Request.Cookies["locale"] ?? "en";
}

<LocalePicker
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    Value="@cookieLocale"
    @bind-Value="locale" />
```

During SSR the component renders the radios with the supplied value
checked, and the document already arrives with the correct `lang`
attribute on `<html>` (set in `App.razor`).

## Built-in locale data

`Locales.cs` ships a 436-row built-in map from locale codes to
English names (derived from `locales.tsv`). The component falls
back to this table when `LocaleLabels` does not have an entry for
a code. You can also use the data directly:

```csharp
using LilyDesignSystem.Blazor.Helpers;

var name = Locales.LocaleName("en_US");      // "English (United States)"
var rtl = Locales.RtlLanguageTags.Contains("ar");  // true
```

## Parameters

See [spec.md §4](./spec.md#4-public-api) for the full table.

Required parameters: `Label`, `Locales`.

Common optional parameters: `Value` (bindable via `@bind-Value`),
`DefaultValue`, `StorageKey`, `DetectFromNavigator`, `LocaleLabels`,
`ApplyDir`, `CssClass`, `Name`.

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `ValueChanged`  | `string` | After selection, drives `@bind-Value`.                |
| `OnChange`      | `string` | After the picker applies a new locale (consumer-form code). |

## Accessibility

- `<fieldset role="radiogroup" aria-label="…">` is the announced
  container.
- Native `<input type="radio">` gives Arrow / Space / Tab
  semantics for free (WAI-ARIA APG, Radio Group pattern).
- Each visible option carries `lang="…"` so its name is pronounced
  in the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi
  text/layout inverts correctly for RTL locales.
- No colour-only meaning; the active state is also visible in the
  resolved `lang` attribute and in `aria-checked` on the radios.

## SSR

The picker is SSR-safe — all DOM writes happen inside
`OnAfterRenderAsync(firstRender:true)`. For flicker-free first
paint, resolve the locale on the server (cookie /
`Accept-Language`) and pass it as `Value`. See
[docs/ssr.md](./docs/ssr.md) for the recipe.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec.md`                     | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                   | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                     | Topic-by-topic agent files.                      |
| `CLAUDE.md`                   | `@AGENTS.md`.                                    |
| `LocalePicker.razor`          | Razor markup.                                    |
| `LocalePicker.razor.cs`       | C# code-behind (partial class).                  |
| `LocalePickerTests.cs`        | bUnit + xUnit spec covering every spec §7 item.  |
| `Locales.cs`                  | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`                 | Canonical 436-row source for `Locales.cs`.       |
| `index.md`                    | This file.                                       |
| `docs/`                       | Deep-dive guides — see [Documentation](#documentation). |
| `examples/`                   | Runnable `.razor` files — see [Examples directory](#examples-directory). |
| `CHANGELOG.md`                | Version history.                                 |

## Documentation

| Guide                                                | Covers                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| [docs/concepts.md](./docs/concepts.md)               | Mental model, lifecycle diagram, why the defaults are what they are.    |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.      |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.      |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring `IStringLocalizer<T>`, ResX, `Microsoft.Extensions.Localization`. |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, FOUC avoidance for Blazor Web App. |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.          |

## Examples directory

Each file in `examples/` is a complete, runnable `.razor` page you
can copy into your project.

| Example                                                                | Demonstrates                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [01_Radios.razor](./examples/01_Radios.razor)                          | The default `<fieldset role="radiogroup">` rendering.              |
| [02_Select.razor](./examples/02_Select.razor)                          | Native `<select>` dropdown via `ChildContent`.                     |
| [03_Buttons.razor](./examples/03_Buttons.razor)                        | Toggle-button group with short codes / glyphs and `aria-pressed`.  |
| [04_RtlDemo.razor](./examples/04_RtlDemo.razor)                        | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [05_NhsStyle.razor](./examples/05_NhsStyle.razor)                      | NHS UK-style language banner with endonyms and `CssClass`.         |
| [06_WithIStringLocalizer.razor](./examples/06_WithIStringLocalizer.razor) | Wiring `IStringLocalizer<T>`.                                  |
| [07_WithResX.razor](./examples/07_WithResX.razor)                      | Per-component `.resx` file driving labels.                         |
| [08_SsrCookie.razor](./examples/08_SsrCookie.razor)                    | Cookie + `IHttpContextAccessor` for flicker-free SSR.              |
| [09_ScopedTarget.razor](./examples/09_ScopedTarget.razor)              | Multiple per-region pickers, each scoped to its own panel.         |
| [10_Combobox.razor](./examples/10_Combobox.razor)                      | Native `<datalist>` type-ahead for 436 built-in locales.           |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.
