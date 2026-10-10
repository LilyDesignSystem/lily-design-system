# Lily Design System™ — Blazor PickerBar

> **Link picker (0.3.0).** Pass `links` (and `labels.link`) to add a `link-picker` — a home icon opening the page links your app defines — as the leftmost icon. It renders only when both are given.

A single page-header row that composes five of the Lily
[`*-picker` helpers](../index.md) — search, theme, locale, text size,
and share, in that order — with two catalog-wide defaults pre-wired, so
you can drop one component into a header instead of assembling and
configuring five.

`motion-picker` and `date-time-picker` are not part of the bar: motion
has no natural spot next to the other three header preferences, and
`date-time-picker` is a form control, not a header control.

## Install

```sh
dotnet add package LilyDesignSystem.Blazor.PickerBar
```

`LilyDesignSystem.Blazor.SearchPicker`, `.ThemePicker`, `.LocalePicker`,
`.TextSizePicker`, and `.SharePicker` install automatically as regular
NuGet dependencies — `PickerBar` is a thin wrapper around them, not a
reimplementation.

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<PickerBar
    Labels="@(new PickerBarLabels
    {
        Search = "Search this site",
        SearchInput = "Search terms",
        SearchSubmit = "Search",
        Theme = "Theme",
        Locale = "Language",
        TextSize = "Text size",
        Share = "Share",
    })"
    ThemesUrl="/assets/themes/"
    Locales="@(new[] { "en", "cy", "gd", "ga" })"
    ShareTargets="@(new[]
    {
        new ShareTarget
        {
            Id = "email",
            Label = "Email",
            Href = (url, title, _) => $"mailto:?subject={title}&body={url}",
        },
    })" />
```

That's a complete, working header row: site search (a search for
`foo` goes to `/?foo`), 45 themes, four locales, the
seven-step text-size scale, and one share destination plus copy-to-URL
if you add `ShareAttributes["CopyLabel"] = "Copy link"`.

## Defaults

- **`Themes`** defaults to `PickerBar.DefaultThemes` — all 45 Lily
  reference theme slugs, alphabetical, with the 8 United Kingdom /
  United States government themes moved to their own alphabetical
  group at the bottom. Pass your own `Themes` list to override.
- **`Sizes`** defaults to `PickerBar.DefaultSizes` — the seven-step
  scale `largest`, `larger`, `large`, `normal`, `small`, `smaller`,
  `smallest` — and the text-size picker starts on `normal`. Pass your
  own `Sizes` list (and `TextSizeAttributes["DefaultValue"]` if you
  want a different starting point) to override.

## Passing extra parameters to one picker

Each wrapped picker takes a `*Attributes` dictionary for anything
beyond what `PickerBar` lifts to the top level — persistence, initial
value, detection, a `*Labels` override map, a custom glyph:

```razor
<PickerBar
    Labels="@Labels"
    ThemesUrl="/assets/themes/"
    Locales="@(new[] { "en", "cy" })"
    SearchAttributes="@(new Dictionary<string, object> { ["Action"] = "/search", ["Placeholder"] = "Search…" })"
    ThemeAttributes="@(new Dictionary<string, object> { ["StorageKey"] = "lily-theme", ["DetectFromSystem"] = true })"
    LocaleAttributes="@(new Dictionary<string, object> { ["StorageKey"] = "lily-locale", ["DetectFromNavigator"] = true })"
    TextSizeAttributes="@(new Dictionary<string, object> { ["StorageKey"] = "lily-text-size" })"
    ShareAttributes="@(new Dictionary<string, object> { ["CopyLabel"] = "Copy link", ["CopiedLabel"] = "Copied" })" />
```

Anything in a `*Attributes` dictionary wins over `PickerBar`'s own
default for that picker — including overriding `Themes`, `Locales`, or
`Sizes` per-picker if you ever needed to (you'd normally just use the
top-level parameter instead). Dictionary keys must match that picker's
own `[Parameter]` property name exactly (e.g. `"StorageKey"`, not
`"storageKey"`).

## Styling

`PickerBar` renders no CSS of its own class beyond the `picker-bar`
root wrapper — style each child through its own package's class hooks
(`search-picker`, `theme-picker`, `locale-picker`, `text-size-picker`,
`share-picker`;
see each package's own `index.md`). A typical header layout:

```css
.picker-bar {
  display: flex;
  gap: var(--theme-space-sm, 0.5rem);
  align-items: center;
}
```

## Accessibility

Every accessible name comes from `Labels` — there is no English
default, because a set of names this catalog invented is exactly the
case the rest of Lily's i18n rule exists for. Each wrapped picker keeps
its own WAI-ARIA APG contract unchanged; see that picker's own `index.md`.

## Full contract

See [`spec/index.md`](./spec/index.md).

---

Lily™ and Lily Design System™ are trademarks.
