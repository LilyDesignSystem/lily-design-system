# LocaleSelect (Blazor helper)

A reusable, headless Blazor locale select that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. It
renders an icon button (`🌐`) that opens a dropdown listbox, built to
the WAI-ARIA Authoring Practices listbox pattern.

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests. For topic
deep-dives see [docs/](./docs/) and for working code see
[examples/](./examples/).

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Examples](#examples)
- [Keyboard](#keyboard)
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
package; the helper is four source files (`LocaleSelect.razor` +
`LocaleSelect.razor.cs` + `Locales.cs` + `locales.tsv`).

## Quick start

Render the select with a `Label` and the list of locales your app
supports. It renders an icon button that opens a dropdown listbox. The
select writes `lang` and `dir` onto `<html>` so your i18n library, your
CSS (`html[dir="rtl"]`), and assistive technology all see the change.

```razor
@using LilyDesignSystem.Blazor.Helpers

<LocaleSelect
    Label="Language"
    Locales="@(new []{ "en", "en_US", "fr", "fr_CA", "ar", "he" })"
    @bind-Value="locale"
    StorageKey="lily-locale"
    DetectFromNavigator="true" />

<p class="locale-select-status" aria-live="polite">
    Active language:
    <span lang="@Locales.Bcp47LocaleTag(locale)">@Locales.LocaleName(locale)</span>
</p>

@code {
    private string locale = "";
}
```

The status line is part of the pattern, not decoration. The closed
control shows only a glyph, so this line is the only place on screen
that says which locale is active. `aria-live="polite"` announces changes
only, staying silent on first paint. The locale's own name carries its
own `lang` so it is pronounced correctly (WCAG 3.1.2). Render it visible
by default; hide it with a visually-hidden class only if the design
truly cannot spare the space. Full rationale:
[docs/accessibility.md](./docs/accessibility.md#the-status-region-is-still-the-recommended-pattern).

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `ValueChanged("ar")` (drives `@bind-Value`),
- fires `OnChange("ar")` (one-shot side effect hook).

The select does NOT translate strings — that is the consumer's i18n
library (e.g. `Microsoft.Extensions.Localization`,
`IStringLocalizer<T>`, custom `CultureInfo` switching). Wire the
bindable `Value` or `OnChange` to your library so it loads the
right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry
locale identifiers with underscores (`en_US`, `zh_Hant_TW`). The
select accepts whichever form you prefer in the `Locales` list and
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

### Default rendering

```razor
<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "cy" })"
    @bind-Value="locale" />
```

Renders (ids abbreviated; the listbox is shown open):

```html
<div class="locale-select">
    <input type="hidden" name="locale" value="en" />
    <button type="button" class="locale-select-button"
            aria-label="Language" aria-haspopup="listbox"
            aria-expanded="true" aria-controls="locale-select-1-list">
        <span class="locale-select-icon" aria-hidden="true">&#127760;</span>
    </button>
    <ul class="locale-select-list" id="locale-select-1-list" role="listbox"
        aria-label="Language" tabindex="-1"
        aria-activedescendant="locale-select-1-option-0">
        <li class="locale-select-option" id="locale-select-1-option-0"
            role="option" aria-selected="true" data-active lang="en">English</li>
        <li class="locale-select-option" id="locale-select-1-option-1"
            role="option" aria-selected="false" lang="cy">Welsh</li>
    </ul>
</div>
```

Reading that markup:

- The **root `<div>`** carries the `locale-select` class hook plus
  `CssClass`, and everything captured by `AdditionalAttributes` spreads
  onto it.
- The **hidden input** carries `Name` and `Value` so the control still
  participates in a form; the listbox itself is not a form control.
- The **glyph** is `🌐︎` (U+1F310 GLOBE WITH MERIDIANS + U+FE0E
  VARIATION SELECTOR-15, for the monochrome text presentation) wrapped in
  `aria-hidden="true"`, so the accessible name comes wholly from
  `Label` — never from the character.
- Each **`<li role="option">`** keeps its own `lang` so screen readers
  pronounce option text in the correct language (WCAG 3.1.2, Language
  of Parts). The button and the list carry **no** `lang`.
- The **listbox carries `hidden`** while closed and drops it while open;
  `aria-expanded` on the button tracks the same state. The sample above
  is the **open** state — while closed the `<ul>` carries `hidden`, and
  neither `aria-activedescendant` nor `data-active` is emitted at all.

Class hooks: `.locale-select` on the root, `.locale-select-button` on
the trigger, `.locale-select-icon` on the glyph, `.locale-select-list`
on the `<ul>`, and `.locale-select-option` on every `<li>`. The active
option additionally carries `[data-active]`, and the selected option
`[aria-selected="true"]`.

### Positioning the listbox

The package ships no CSS, so an open listbox participates in normal
flow and shoves the rest of the page around. Positioning it is your
job:

```css
.locale-select { position: relative; }

.locale-select-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;   /* logical, not `left` */
    min-inline-size: 12ch;
}

.locale-select-option[data-active] { outline: 2px solid currentColor; }
.locale-select-option[aria-selected="true"] { font-weight: 600; }
```

Use **logical properties** (`inset-inline-start`, `min-inline-size`)
rather than physical ones. This control changes `dir` on the document
root, possibly while the listbox is open, and logical properties let
the open list re-mirror around the button instead of jumping
off-screen mid-interaction.

### Pretty labels for option text

By default the select uses the English names from `locales.tsv`
(and falls back to the raw code). Override per-code with
`LocaleLabels`:

```razor
<LocaleSelect
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

### Replacing the glyph

`ChildContent` is a `RenderFragment<LocaleSelectContext>` that
**replaces the glyph inside the button**. It does not render options —
the component always owns the listbox. The context gives you `Value`,
`Open`, and `LabelFor`:

```razor
<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "fr", "es", "de", "ar" })"
    @bind-Value="locale"
    StorageKey="lily-locale">
    <ChildContent Context="ctx">
        @* Inline SVG is the robust choice: no font-coverage risk.
           Keep it aria-hidden — the name still comes from Label. *@
        <svg class="locale-select-icon" aria-hidden="true" focusable="false"
             width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" />
            <ellipse cx="10" cy="10" rx="3.5" ry="8" fill="none" stroke="currentColor" />
            <path d="M2 10h16" fill="none" stroke="currentColor" />
        </svg>
        <span class="locale-select-code">@ctx.LabelFor(ctx.Value)</span>
    </ChildContent>
</LocaleSelect>
```

Set `Label` even when the fragment renders visible text: the
accessible name always comes from the button's `aria-label`.

### Building a fully custom control

`ChildContent` no longer gives you the whole control, so if you want
different markup entirely — a button group, a filtering combobox, a
third-party picker — build it yourself and drive this helper's
lifecycle through a `@ref` and the static `Locales.*` helpers:

```razor
<LocaleSelect @ref="localeSelect"
              Label="Language"
              Locales="@codes"
              @bind-Value="locale"
              StorageKey="lily-locale"
              class="visually-hidden" />

<ul role="list">
    @foreach (var l in codes)
    {
        <li>
            <button type="button"
                    aria-pressed="@(locale == l)"
                    lang="@Locales.Bcp47LocaleTag(l)"
                    dir="@(Locales.IsRtlLocale(l) ? "rtl" : "ltr")"
                    @onclick="@(async () => await localeSelect!.SetLocaleAsync(l))">
                @Locales.LocaleName(l)
            </button>
        </li>
    }
</ul>

@code {
    private LocaleSelect? localeSelect;
    private string[] codes = { "en", "fr", "ar" };
    private string locale = "";
}
```

`SetLocaleAsync(string)` applies a locale exactly as a click on an
option would — `lang`, `dir`, storage, `ValueChanged`, `OnChange` — so
the helper still owns the whole apply lifecycle.

### Wiring `IStringLocalizer<T>`

```razor
@inject IStringLocalizer<SharedResources> Localizer

<LocaleSelect
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

<LocaleSelect
    Label="Language"
    Locales="@(new[] { "en", "fr", "ar" })"
    Value="@cookieLocale"
    @bind-Value="locale" />
```

During SSR the component renders the button and the (closed) listbox
with the supplied value marked `aria-selected`, and the document
already arrives with the correct `lang` attribute on `<html>` (set in
`App.razor`).

## Keyboard

The component implements the WAI-ARIA APG listbox keyboard contract
itself — there is no native `<select>` doing it for you.

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

Focus stays on the `<ul>` while the listbox is open; the active option
is conveyed by `aria-activedescendant`, never by moving DOM focus onto
an `<li>`. Style `[data-active]` so sighted keyboard users can see
where the arrow keys have moved them. Two Blazor-specific deviations
from the canonical Svelte contract are documented in
[docs/accessibility.md](./docs/accessibility.md#blazor-specific-deviations).

## Built-in locale data

`Locales.cs` ships a 436-row built-in map from locale codes to
English names (derived from `locales.tsv`). The select falls
back to this table when `LocaleLabels` does not have an entry for
a code. You can also use the data directly:

```csharp
using LilyDesignSystem.Blazor.Helpers;

var name = Locales.LocaleName("en_US");      // "English (United States)"
var rtl = Locales.RtlLanguageTags.Contains("ar");  // true
```

## Parameters

See [spec/index.md §4](./spec/index.md#4-public-api) for the full table.

Required parameters: `Label`, `Locales`. Because the button is
icon-only, `Label` is its entire accessible name.

Common optional parameters: `Value` (bindable via `@bind-Value`),
`DefaultValue`, `StorageKey`, `DetectFromNavigator`, `LocaleLabels`,
`ApplyDir`, `CssClass`, `Name`.

There is **no `Placeholder` parameter**. It existed only to pin a
native `<select>`'s closed display; there is no `<select>` any more.

The parameters that attach to specific parts of the markup:

| Parameter              | Attaches to                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `Label`                | `aria-label` on **both** the button and the `<ul role="listbox">`.  |
| `Name`                 | `name` on the hidden input that carries `Value` for form posts.     |
| `CssClass`             | Merged into the class list of the root `<div>`.                     |
| `AdditionalAttributes` | Captures unmatched attributes; spread onto the root `<div>`.        |
| `ChildContent`         | Replaces the glyph inside the button; receives `{ Value, Open, LabelFor }`. |

## Events

| Event           | Payload  | When                                                  |
| --------------- | -------- | ----------------------------------------------------- |
| `ValueChanged`  | `string` | After selection, drives `@bind-Value`.                |
| `OnChange`      | `string` | After the select applies a new locale (consumer-form code). |

## Accessibility

- The `<button aria-label="…">` is the announced trigger, carrying
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`.
- The `<ul role="listbox">` takes focus while open and conveys the
  active option with `aria-activedescendant`; exactly one
  `<li role="option">` is `aria-selected="true"` (WCAG 4.1.2).
- The component implements the full APG listbox keyboard contract
  itself — see [Keyboard](#keyboard).
- Each locale `<li role="option">` carries `lang="…"` so its name is
  pronounced in the right language (WCAG 3.1.2, Language of Parts).
  This is *more* reliable than a native `<select>`, whose popup is
  often drawn by the OS and ignores per-option `lang` entirely.
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi
  text/layout inverts correctly for RTL locales.
- No colour-only meaning; state rides `aria-selected`, `data-active`,
  and the resolved `lang` / `dir` on the document root.

Three tradeoffs come with an icon button plus a custom listbox. None is
a bug; all are worth knowing before you ship:

1. **The accessible name rests entirely on `aria-label`.** The button
   has no visible text and the glyph is `aria-hidden`. An empty,
   missing, or untranslated `Label` leaves the control unnameable.
2. **A custom listbox has weaker assistive-technology support than a
   native `<select>`.** Correct ARIA is necessary but not sufficient;
   behaviour varies more on mobile screen readers and in browse modes.
3. **The glyph is a font character, not an asset.** `🌐` sits in the
   emoji block. The trailing U+FE0E requests the monochrome text
   presentation, but not every platform honours it, so it may still
   render as colour emoji, as a monochrome outline, or not at all.
   Supply an inline SVG via `ChildContent` if that matters.

Full detail, the screen-reader matrix, and the Blazor-specific
deviations: [docs/accessibility.md](./docs/accessibility.md).

## SSR

The select is SSR-safe — all DOM writes happen inside
`OnAfterRenderAsync(firstRender:true)`. For flicker-free first
paint, resolve the locale on the server (cookie /
`Accept-Language`) and pass it as `Value`. See
[docs/ssr.md](./docs/ssr.md) for the recipe.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec/index.md`                     | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                   | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                     | Topic-by-topic agent files.                      |
| `CLAUDE.md`                   | `@AGENTS.md`.                                    |
| `LocaleSelect.razor`          | Razor markup.                                    |
| `LocaleSelect.razor.cs`       | C# code-behind (partial class).                  |
| `LocaleSelectTests.cs`        | bUnit + xUnit spec covering every spec §7 item.  |
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
| [docs/parameters-reference.md](./docs/parameters-reference.md) | Field-by-field reference for every parameter, method, and static. |
| [docs/styling.md](./docs/styling.md)                 | Class hooks, state hooks, positioning CSS, the status region.          |
| [docs/custom-rendering.md](./docs/custom-rendering.md) | Replacing the button glyph via `ChildContent`; driving from your own UI. |
| [docs/recipes.md](./docs/recipes.md)                 | Task-shaped solutions — endonyms, cookies, culture switching, sorting. |
| [docs/troubleshooting.md](./docs/troubleshooting.md) | Symptom-first fixes for the common failure modes.                      |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.      |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.      |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring `IStringLocalizer<T>`, ResX, `Microsoft.Extensions.Localization`. |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, FOUC avoidance for Blazor Web App. |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.          |

## Examples directory

Each file in `examples/` is a complete, runnable `.razor` page you
can copy into your project.

All ten examples target the current icon-button + APG-listbox API.
Examples that need an affordance other than the component's own button
(a toggle-button group, an NHS-style endonym banner, a `<datalist>`
combobox) drive it externally via `@ref` + `SetLocaleAsync`, because
`ChildContent` replaces only the glyph inside the button.

| Example                                                                | Demonstrates                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Basic.razor](./examples/Basic.razor)                                  | The default rendering, plus the `aria-live` status region.         |
| [CustomRendering.razor](./examples/CustomRendering.razor)              | Custom button glyph via `ChildContent` — inline SVG, state-aware caret. |
| [ExternalButtons.razor](./examples/ExternalButtons.razor)              | Toggle-button group driving `SetLocaleAsync` via `@ref`.           |
| [RtlDemo.razor](./examples/RtlDemo.razor)                              | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [NhsStyle.razor](./examples/NhsStyle.razor)                            | NHS UK-style endonym banner driving `SetLocaleAsync` via `@ref`.   |
| [WithIStringLocalizer.razor](./examples/WithIStringLocalizer.razor)    | Wiring `IStringLocalizer<T>`.                                      |
| [WithResX.razor](./examples/WithResX.razor)                            | Per-component `.resx` file driving labels.                         |
| [SsrCookie.razor](./examples/SsrCookie.razor)                          | Cookie + `IHttpContextAccessor` for flicker-free SSR.              |
| [ScopedTarget.razor](./examples/ScopedTarget.razor)                    | Multiple per-region selects, each scoped to its own panel.         |
| [Combobox.razor](./examples/Combobox.razor)                            | `<datalist>` type-ahead over the 436 built-in locales, driving `SetLocaleAsync`. |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.
